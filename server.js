const http = require('http');
const fs = require('fs');
const path = require('path');

// Ensure assets/images exists
const assetsDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy generated artifact images if available
const artifactsDir = 'C:\\Users\\gurud\\.gemini\\antigravity\\brain\\cb49fa13-6e21-4bd4-9f8c-478e16176fac';
const imagesToCopy = [
  { src: 'manan_profile_avatar_1791472959607.jpg', dest: 'profile.jpg' },
  { src: 'web_platform_mockup_1791472981183.jpg', dest: 'project-web.jpg' },
  { src: 'ai_chatbot_mockup_1791473005973.jpg', dest: 'project-chatbot.jpg' },
  { src: 'hackathon_winner_cert_1791473028963.jpg', dest: 'cert-hackathon.jpg' },
  { src: 'academic_honors_cert_1791473052235.jpg', dest: 'cert-academic.jpg' }
];

imagesToCopy.forEach(item => {
  const srcPath = path.join(artifactsDir, item.src);
  const destPath = path.join(assetsDir, item.dest);
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${item.src} -> ${item.dest}`);
    } catch (e) {
      console.warn(`Could not copy ${item.src}:`, e.message);
    }
  }
});

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

const startServer = (port) => {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`CYBERCITY PORTFOLIO LIVE AT: http://localhost:${port}/`);
  });
};

startServer(3000);
