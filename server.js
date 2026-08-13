const http = require('http');
const path = require('path');
const fs = require('fs');

const PaymentController = require('./src/controllers/PaymentController');
const SessionManager = require('./src/utils/SessionManager');
// Require database to initialize it on startup
require('./src/config/database');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;

    // ----- API ROUTES -----
    
    // POST /api/payment/submit - Siswa
    if (pathname === '/api/payment/submit' && req.method === 'POST') {
        return SessionManager.requireRole(['siswa'])(req, res, () => {
            PaymentController.submitPayment(req, res);
        });
    }

    // GET /api/payment/status - Admin / Petugas
    // Example: /api/payment/status?action=konfirmasi&id=1
    if (pathname === '/api/payment/status' && req.method === 'GET') {
        return SessionManager.requireRole(['admin', 'petugas'])(req, res, () => {
            PaymentController.updatePaymentStatus(req, res);
        });
    }

    // ----- STATIC FILE SERVING -----
    let staticPath;
    if (pathname.endsWith('.html') || pathname === '/') {
        let viewFile = pathname === '/' ? 'index.html' : pathname;
        staticPath = path.join(__dirname, 'src', 'views', viewFile);
    } else {
        staticPath = path.join(__dirname, 'public', pathname);
    }
    
    fs.stat(staticPath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(staticPath).toLowerCase();
        let mimeType = 'text/html';
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };
        if (mimeTypes[ext]) {
            mimeType = mimeTypes[ext];
        }

        res.writeHead(200, { 'Content-Type': mimeType });
        fs.createReadStream(staticPath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running natively on http://localhost:${PORT}`);
});
