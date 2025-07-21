import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Request, Response } from 'express';
import type { Feedback } from './src/types';
import { aggregateStats } from './src/utils/aggregateStats';

// Load environment variables
dotenv.config();

// Constants
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Achive Express Server',
    status: 'running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    openai_configured: !!OPENAI_API_KEY
  });
});

// Badge generation endpoint
app.post('/badge', (req: Request, res: Response) => {
  try {
    // Parse feedbacks from request body
    const feedbacks: Feedback[] = req.body.feedbacks || [];
    
    // Aggregate feedback statistics
    const stats = aggregateStats(feedbacks);
    console.log('aggregateStats result:', stats);
    
    // Build prompt for OpenAI (placeholder for now)
    const prompt = `Generate a badge based on the following feedback statistics:
    - Positive feedback: ${stats.positive}
    - Neutral feedback: ${stats.neutral}
    - Negative feedback: ${stats.negative}
    Total feedbacks: ${feedbacks.length}`;
    
    // TODO: Call OpenAI API with the prompt
    // For now, return mock response
    res.json({
      success: true,
      stats: stats,
      prompt: prompt,
      badgePNG: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG placeholder
      message: 'Badge generated successfully'
    });
  } catch (error) {
    console.error('Error generating badge:', error);
    res.status(500).json({
      error: 'Failed to generate badge',
      message: NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
});

// API routes placeholder
app.use('/api', (req: Request, res: Response) => {
  res.json({
    message: 'API endpoint',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`✅ OpenAI API Key: ${OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

export default app;
export { OPENAI_API_KEY };
