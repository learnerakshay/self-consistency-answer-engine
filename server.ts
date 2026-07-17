import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import orchestrationRoutes from './server/routes/orchestrationRoutes';
import { checkKeys } from './server/config/config';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Enable CORS and JSON parsing
  app.use(cors());
  app.use(express.json());

  // Warn on start if API keys are missing from environment
  checkKeys();

  // 1. Mount API routes FIRST
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', orchestrationRoutes);

  // 2. Mount Vite middleware for SPA Asset serving
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running in Development Mode: Mounting Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Running in Production Mode: Serving compiled static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Server startup failed:', err);
});
