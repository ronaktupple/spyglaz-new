import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      '/api': {
        target: ' https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // Remove origin and referer headers to avoid CORS issues
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          
          // Handle CORS headers properly
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Remove any existing CORS headers from the target
            delete proxyRes.headers['access-control-allow-origin'];
            delete proxyRes.headers['access-control-allow-methods'];
            delete proxyRes.headers['access-control-allow-headers'];
            
            // Add our own CORS headers
            proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
          
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
            if (res.writeHead) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true'
              });
              res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
            }
          });
        },
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
