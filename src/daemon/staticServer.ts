// PortHub Static File Server
// "Serving Up Dashboard Like a Professional"

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname, resolve } from 'path';
import chalk from 'chalk';

export interface StaticServer {
  stop: () => Promise<void>;
  port: number;
  url: string;
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

export async function startStaticServer(port: number, staticDir: string): Promise<StaticServer> {
  console.log(chalk.hex('#FF9900')(`🌐 Starting PortHub Dashboard server on port ${port}...`));
  
  const absoluteStaticDir = resolve(staticDir);
  console.log(chalk.gray(`📁 Serving static files from: ${absoluteStaticDir}`));
  
  return new Promise((resolve, reject) => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        await handleRequest(req, res, absoluteStaticDir);
      } catch (error) {
        console.error(chalk.red('💥 Static server error:'), error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(chalk.green(`✅ PortHub Dashboard available at ${url}`));
      console.log(chalk.gray('"Dashboard ready for your viewing pleasure"'));
      
      resolve({
        port,
        url,
        stop: async () => {
          console.log(chalk.gray('🌐 Stopping PortHub Dashboard server...'));
          return new Promise<void>((resolveStop) => {
            server.close(() => {
              console.log(chalk.gray('🌐 Dashboard server stopped gracefully'));
              resolveStop();
            });
          });
        }
      });
    });

    server.on('error', (error) => {
      console.error(chalk.red('💥 Dashboard server error:'), error);
      reject(error);
    });
  });
}

async function handleRequest(req: IncomingMessage, res: ServerResponse, staticDir: string): Promise<void> {
  let requestPath = req.url || '/';
  
  // Remove query parameters
  const questionMarkIndex = requestPath.indexOf('?');
  if (questionMarkIndex !== -1) {
    requestPath = requestPath.substring(0, questionMarkIndex);
  }
  
  // Default to index.html for root and directory requests
  if (requestPath === '/' || requestPath.endsWith('/')) {
    requestPath = '/index.html';
  }
  
  // Prevent directory traversal
  if (requestPath.includes('..') || requestPath.includes('\\')) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  
  const filePath = join(staticDir, requestPath);
  
  try {
    // Check if file exists
    const stats = await stat(filePath);
    
    if (!stats.isFile()) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    
    // Read file
    const content = await readFile(filePath);
    
    // Set content type
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    
    // Add CORS headers for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.statusCode = 200;
    res.end(content);
    
    console.log(chalk.gray(`📄 Served: ${requestPath} (${content.length} bytes)`));
    
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File not found - serve index.html for SPA routing
      try {
        const indexPath = join(staticDir, 'index.html');
        const indexContent = await readFile(indexPath);
        
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(indexContent);
        
        console.log(chalk.gray(`📄 SPA fallback: ${requestPath} → index.html`));
      } catch (indexError) {
        res.statusCode = 404;
        res.end('Not Found');
        console.log(chalk.yellow(`⚠️  404: ${requestPath}`));
      }
    } else {
      throw error;
    }
  }
}
