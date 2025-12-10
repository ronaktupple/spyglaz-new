// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws',
    devProxyUrl: import.meta.env.VITE_DEV_PROXY_URL || '/api',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
