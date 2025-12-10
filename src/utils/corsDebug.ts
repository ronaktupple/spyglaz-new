/**
 * CORS Debug Utilities
 * Helps diagnose and handle CORS-related issues
 */

export interface CORSInfo {
  origin: string;
  targetUrl: string;
  isDevelopment: boolean;
  hasProxy: boolean;
}

export function getCORSInfo(): CORSInfo {
  const origin = window.location.origin;
  const targetUrl = ' https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws';
  const isDevelopment = import.meta.env.DEV;

  return {
    origin,
    targetUrl,
    isDevelopment,
    hasProxy: isDevelopment,
  };
}

export function getCORSRecommendations(): string[] {
  const info = getCORSInfo();
  const recommendations: string[] = [];

  if (!info.isDevelopment) {
    recommendations.push(
      'Production environment detected. CORS must be properly configured on the server.',
      'The Lambda function is sending multiple Access-Control-Allow-Origin headers, which is invalid.',
      'Server needs to send only one Access-Control-Allow-Origin header.',
      'For production, the server should send: Access-Control-Allow-Origin: https://agentic-growth-pilot-11.vercel.app'
    );
  } else {
    recommendations.push(
      'Development environment detected. Using proxy to avoid CORS issues.',
      'If you still see CORS errors, check that the Vite dev server is running.',
      'Proxy configuration should handle CORS headers automatically.'
    );
  }

  return recommendations;
}

export function logCORSInfo(): void {
  const info = getCORSInfo();
  const recommendations = getCORSRecommendations();

  console.group('🔍 CORS Debug Information');


  console.group('📋 Recommendations');
  recommendations.forEach((rec, index) => {
  });
  console.groupEnd();

  console.groupEnd();
}

export function createCORSRequest(url: string, options: RequestInit = {}): RequestInit {
  // Add CORS-specific headers for debugging
  const corsOptions: RequestInit = {
    ...options,
    mode: 'cors' as RequestMode,
    credentials: 'include' as RequestCredentials,
    headers: {
      ...options.headers,
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  return corsOptions;
}
