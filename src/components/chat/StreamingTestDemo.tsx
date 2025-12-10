import React, { useState, useEffect } from 'react';
import StreamingHtmlRenderer from './StreamingHtmlRenderer';

const sampleStreamingData = `data: {"type": "status", "content": "Starting agent"}

data: {"type": "status", "content": "Agent is preparing to process your request"}

data: {"type": "status", "content": "Agent is analyzing your request"}

data: {"type": "status", "content": "Agent has completed analysis"}

data: {"type": "status", "content": "Agent is using find_opportunities_tool"}

data: {"type": "status", "content": "Completed tool execution"}

data: {"type": "status", "content": "Agent is planning next moves"}

data: {"type": "heartbeat", "content": "Agent still working... (10s)"}

data: {"type": "status", "content": "Agent has completed analysis"}

data: {"type": "status", "content": "Agent is analyzing data"}

data: {"type": "status", "content": "Completed tool execution"}

data: {"type": "status", "content": "Agent is refining approach"}

data: {"type": "heartbeat", "content": "Agent still working... (10s)"}

data: {"type": "status", "content": "Agent has completed analysis"}

data: {"type": "status", "content": "Agent execution completed, preparing response"}

data: {"type": "status", "content": "Agent completed request"}

data: {"type": "response", "content": "Based on the ML scoring analysis, I found 53 produ"}

data: {"type": "response", "content": "cers with high likelihood (score ≥70) to submit la"}

data: {"type": "response", "content": "rge case policies in the next 30 days.\nTop 10 High"}

data: {"type": "response", "content": "-Potential Producers:\n1. Janet Russo (Producer ID:"}

data: {"type": "response", "content": " 56) - Annuity opportunity, Score: 72, YTD Premium"}

data: {"type": "response", "content": ": $5,765,845\n2. William Flores (Producer ID: 74) -"}

data: {"type": "response", "content": " Life opportunity, Score: 70, YTD Premium: $4,892,"}

data: {"type": "response", "content": "156\n3. Michael Chen (Producer ID: 23) - Life oppor"}

data: {"type": "response", "content": "tunity, Score: 75, YTD Premium: $4,234,892\n4. Sara"}

data: {"type": "response", "content": "h Martinez (Producer ID: 12) - Annuity opportunity"}

data: {"type": "response", "content": ", Score: 78, YTD Premium: $3,987,445\n5. David Thom"}

data: {"type": "response", "content": "pson (Producer ID: 67) - Life opportunity, Score: "}

data: {"type": "response", "content": "73, YTD Premium: $3,756,223\n6. Lisa Wang (Producer"}

data: {"type": "response", "content": " ID: 89) - Annuity opportunity, Score: 71, YTD Pre"}

data: {"type": "response", "content": "mium: $3,445,667\n7. Robert Johnson (Producer ID: 3"}

data: {"type": "response", "content": "4) - Life opportunity, Score: 76, YTD Premium: $3,"}

data: {"type": "response", "content": "234,889\n8. Amanda Rodriguez (Producer ID: 45) - An"}

data: {"type": "response", "content": "nuity opportunity, Score: 74, YTD Premium: $2,998,"}

data: {"type": "response", "content": "445\n9. Kevin O'Brien (Producer ID: 78) - Life oppo"}

data: {"type": "response", "content": "rtunity, Score: 72, YTD Premium: $2,887,223\n10. Mi"}

data: {"type": "response", "content": "chelle Foster (Producer ID: 91) - Annuity opportun"}

data: {"type": "response", "content": "ity, Score: 70, YTD Premium: $2,756,334\nOpportunit"}

data: {"type": "response", "content": "y Breakdown:\n- Life Insurance: 28 producers\n- Annu"}

data: {"type": "response", "content": "ity: 25 producers\nThese producers are ranked by YT"}

data: {"type": "response", "content": "D premium production and have ML scores indicating"}

data: {"type": "response", "content": " strong likelihood of submitting large cases withi"}

data: {"type": "response", "content": "n 30 days. Focus outreach efforts on the top perfo"}

data: {"type": "response", "content": "rmers for maximum impact."}

data: {"type": "complete", "content": "Response complete", "session_id": "a4969937-a31d-436c-883c-020ab43deb35", "user_id": "ui_dev_user@spyglaz.com", "metadata": {"tool_calls": 0, "response_length": 1375, "files_count": 0}}`;

export const StreamingTestDemo: React.FC = () => {
  const [responseContent, setResponseContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const simulateStreaming = () => {
    setIsStreaming(true);
    setResponseContent('');
    
    const lines = sampleStreamingData.split('\n');
    let currentContent = '';
    let responseIndex = 0;

    const processLine = (lineIndex: number) => {
      if (lineIndex >= lines.length) {
        setIsStreaming(false);
        return;
      }

      const line = lines[lineIndex].trim();
      if (line.startsWith('data: ')) {
        try {
          const jsonText = line.slice(6);
          const data = JSON.parse(jsonText);
          
          if (data.type === 'response') {
            currentContent += data.content;
            setResponseContent(currentContent);
          }
        } catch (e) {
          console.warn('Failed to parse line:', line);
        }
      }

      setTimeout(() => processLine(lineIndex + 1), 50);
    };

    processLine(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Streaming HTML Renderer Test</h1>
      <p className="text-muted-foreground mb-6">
        This demo shows how the new HTML renderer handles streaming data with proper line breaks and formatting.
      </p>
      
      <div className="mb-4">
        <button
          onClick={simulateStreaming}
          disabled={isStreaming}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isStreaming ? 'Streaming...' : 'Start Streaming Demo'}
        </button>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-semibold mb-4">Streaming Response:</h3>
        <div className="min-h-[200px]">
          {responseContent ? (
            <StreamingHtmlRenderer
              messageId="test-message"
              content={responseContent}
            />
          ) : (
            <p className="text-muted-foreground">Click "Start Streaming Demo" to see the formatted response.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingTestDemo;
