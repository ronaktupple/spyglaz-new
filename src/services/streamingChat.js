import Cookies from 'js-cookie';

// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws';

export class StreamingChatService {
  constructor() {
    this.eventSource = null;
    this.isConnected = false;
    this.currentReader = null;
    this.isReaderReleased = false;
    this.abortController = null;
  }

  async startStreamingChat(options) {
    const { message, session_id, onThinking, onResponse, onComplete, onError } = options;
    
    const token = Cookies.get('access_token');
    if (!token) {
      onError?.({ message: 'No access token found' });
      return;
    }

    // Create abort controller for this session
    this.abortController = new AbortController();
    let retryCount = 0;
    const maxRetries = 3;

    const cleanupReader = () => {
      if (this.currentReader && !this.isReaderReleased) {
        try {
          this.currentReader.releaseLock();
          this.isReaderReleased = true;
        } catch (releaseError) {
          console.warn('Reader already released or in invalid state:', releaseError);
        }
      }
    };

    const attemptStreaming = async () => {
      try {
        // Create a POST request with the message
        const response = await fetch(`${API_BASE_URL}/agent/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            session_id,
          }),
          signal: this.abortController?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        this.currentReader = response.body.getReader();
        this.isReaderReleased = false;
        const decoder = new TextDecoder();
        let lastActivityTime = Date.now();

        // Heartbeat to detect connection issues
        const heartbeatInterval = setInterval(() => {
          const timeSinceLastActivity = Date.now() - lastActivityTime;
          if (timeSinceLastActivity > 30000) { // 30 seconds without activity
            console.warn('Stream heartbeat timeout, attempting recovery');
            clearInterval(heartbeatInterval);
            throw new Error('Stream connection timeout');
          }
        }, 10000);

        try {
          while (true) {
            const { done, value } = await this.currentReader.read();
            
            if (done) {
              break;
            }

            lastActivityTime = Date.now();
            const chunk = decoder.decode(value, { stream: false });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(line.slice(6));
                  this.handleEvent(eventData, { onThinking, onResponse, onComplete, onError });
                } catch (parseError) {
                  console.warn('Failed to parse SSE data:', parseError);
                  
                  // Fallback parsing for malformed JSON
                  if (line.includes('"type"') && line.includes('"content"')) {
                    try {
                      const contentMatch = line.match(/"content"\s*:\s*"([^"]*)"/);
                      if (contentMatch && contentMatch[1]) {
                        const partialEvent = {
                          type: 'response',
                          content: contentMatch[1]
                        };
                        this.handleEvent(partialEvent, { onThinking, onResponse, onComplete, onError });
                      }
                    } catch (fallbackError) {
                      console.warn('Fallback parsing also failed:', fallbackError);
                    }
                  }
                }
              }
            }
          }
        } finally {
          clearInterval(heartbeatInterval);
          cleanupReader();
        }
      } catch (error) {
        console.error(`Streaming attempt ${retryCount + 1} failed:`, error);
        
        // Clean up current reader before retry
        cleanupReader();
        
        // Check if we should retry
        if (retryCount < maxRetries && 
            (error instanceof Error && 
             (error.message.includes('timeout') || 
              error.message.includes('connection') ||
              error.message.includes('network')))) {
          
          retryCount++;
          
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          
          // Attempt retry
          return attemptStreaming();
        } else {
          // Max retries reached or non-retryable error
          throw error;
        }
      }
    }

    try {
      await attemptStreaming();
    } catch (error) {
      console.error('Streaming chat error:', error);
      onError?.(error);
    } finally {
      // Final cleanup
      cleanupReader();
      this.abortController = null;
    }
  }

  handleEvent(eventData, handlers) {
    const { type, content } = eventData;

    switch (type) {
      case 'thinking':
        handlers.onThinking?.(content);
        break;
      case 'response':
        handlers.onResponse?.(content);
        break;
      case 'complete':
        handlers.onComplete?.(content);
        break;
      case 'error':
        handlers.onError?.(content);
        break;
      default:
        console.warn('Unknown event type:', type);
    }
  }

  stopStreaming() {
    // Abort current request if active
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Clean up reader
    if (this.currentReader && !this.isReaderReleased) {
      try {
        this.currentReader.releaseLock();
        this.isReaderReleased = true;
      } catch (releaseError) {
        console.warn('Reader already released or in invalid state:', releaseError);
      }
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.isConnected = false;
  }

  isStreaming() {
    return this.isConnected;
  }
}

export const streamingChatService = new StreamingChatService();
