import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Request, Response } from 'express';
import type { Feedback } from './src/types';
import { aggregateStats } from './src/utils/aggregateStats';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// ...environment setup, constants, app initialization, middleware...

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

// In-memory badge store
const badges: Record<string, { id: string; name: string; feedback: any[]; imageB64: string }> = {};

// PATCH endpoint to update badge image with a new prompt (after app and badges are declared, after middleware)
// Place here, before other route definitions
app.patch('/api/badge/:id/prompt', async (req: Request, res: Response) => {
  try {
    const badge = badges[req.params.id];
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    // Compose a new prompt for OpenAI using the original badge context and the new user prompt
    const basePrompt = `Create a flat 512x512 transparent achievement badge for employee: ${badge.name}. Feedback: ${badge.feedback.map((f: any) => `${f.category}: ${f.message}`).join('; ')}`;
    const fullPrompt = `${basePrompt}. Additional edit: ${prompt}`;

    // Call OpenAI image generation endpoint
    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    });
    const openaiData = await openaiRes.json();
    if (openaiData.error) {
      throw new Error(`OpenAI API error: ${openaiData.error.message || JSON.stringify(openaiData.error)}`);
    }
    const imageB64 = openaiData.data?.[0]?.b64_json;
    if (!imageB64) {
      throw new Error('OpenAI did not return an image');
    }
    // Debug: compare old and new imageB64
    console.log('Old imageB64 (start):', badge.imageB64.slice(0, 100));
    console.log('New imageB64 (start):', imageB64.slice(0, 100));
    // Create a new badge with a new id
    const newId = uuidv4();
    badges[newId] = {
      id: newId,
      name: badge.name,
      feedback: badge.feedback,
      imageB64
    };
    res.json({ id: newId, imageB64 });
  } catch (error) {
    console.error('Error updating badge image:', error);
    res.status(500).json({
      error: 'Failed to update badge image',
      message: NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
});

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



app.post('/api/badge', async (req: Request, res: Response) => {
  try {
    const { name, feedback } = req.body;
    if (!name || !Array.isArray(feedback)) {
      return res.status(400).json({ error: 'Missing name or feedback array' });
    }

    // Build prompt string for OpenAI
    const prompt = `Create a flat 512x512 transparent achievement badge for employee: ${name}. Feedback: ${feedback.map((f: any) => `${f.category}: ${f.message}`).join('; ')}`;

    // Call OpenAI image API (official endpoint)
    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    });
    const openaiData = await openaiRes.json();
    if (openaiData.error) {
      throw new Error(`OpenAI API error: ${openaiData.error.message || JSON.stringify(openaiData.error)}`);
    }
    const imageB64 = openaiData.data?.[0]?.b64_json;
    if (!imageB64) {
      throw new Error('OpenAI did not return an image');
    }

    // Store badge in memory
    const id = uuidv4();
    badges[id] = { id, name, feedback, imageB64 };

    res.json({ id });
  } catch (error) {
    console.error('Error generating badge:', error);
    res.status(500).json({
      error: 'Failed to generate badge',
      message: NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
});

// GET badge by id
app.get('/api/badge/:id', (req: Request, res: Response) => {
  const badge = badges[req.params.id];
  if (!badge) {
    return res.status(404).json({ error: 'Badge not found' });
  }
  res.json({
    id: badge.id,
    name: badge.name,
    feedback: badge.feedback,
    imageB64: badge.imageB64
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
