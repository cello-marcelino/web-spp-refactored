const http = require('http');
const path = require('path');
const fs = require('fs');

const PaymentController = require('./src/controllers/PaymentController');
const SessionManager = require('./src/utils/SessionManager');
// Require database to initialize it on startup
require('./src/config/database');

const PORT = 5500;

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;

    // ----- API ROUTES -----
    
    // Auth Routes
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        return require('./src/controllers/AuthController').login(req, res);
    }
    if (pathname === '/logout') {
        return require('./src/controllers/AuthController').logout(req, res);
    }
    
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

    // GET /api/payment/history - All Roles
    if (pathname === '/api/payment/history' && req.method === 'GET') {
        return SessionManager.requireRole()(req, res, () => {
            PaymentController.getHistory(req, res);
        });
    }

    // GET /api/statistics - Admin / Petugas
    if (pathname === '/api/statistics' && req.method === 'GET') {
        return SessionManager.requireRole(['admin', 'petugas'])(req, res, () => {
            PaymentController.getStatistics(req, res);
        });
    }

    // ----- USER MANAGEMENT ROUTES -----
    const UserController = require('./src/controllers/UserController');
    
    if (pathname === '/api/stats/school' && req.method === 'GET') {
        return SessionManager.requireRole(['siswa', 'admin', 'petugas'])(req, res, () => {
            UserController.getSchoolStats(req, res);
        });
    }

    // CRUD Tarif/Jurusan (Admin Only)
    if (pathname === '/api/tarif' && req.method === 'GET') {
        return SessionManager.requireRole(['admin'])(req, res, () => UserController.getAllTarif(req, res));
    }
    if (pathname === '/api/tarif/create' && req.method === 'POST') {
        return SessionManager.requireRole(['admin'])(req, res, () => UserController.createTarif(req, res));
    }
    if (pathname === '/api/tarif/update' && req.method === 'POST') {
        return SessionManager.requireRole(['admin'])(req, res, () => UserController.updateTarif(req, res));
    }
    if (pathname === '/api/tarif/delete' && req.method === 'GET') {
        return SessionManager.requireRole(['admin'])(req, res, () => UserController.deleteTarif(req, res));
    }

    // CRUD Siswa (Admin & Petugas)
    if (pathname.startsWith('/api/users/siswa')) {
        return SessionManager.requireRole(['admin', 'petugas'])(req, res, () => {
            if (pathname === '/api/users/siswa' && req.method === 'GET') return UserController.listSiswa(req, res);
            if (pathname === '/api/users/siswa/create' && req.method === 'POST') return UserController.createSiswa(req, res);
            if (pathname === '/api/users/siswa/update' && req.method === 'POST') return UserController.updateSiswa(req, res);
            if (pathname === '/api/users/siswa/delete' && req.method === 'GET') return UserController.deleteSiswa(req, res);
        });
    }

    // Profile endpoint (All Roles)
    if (pathname === '/api/users/profile' && req.method === 'GET') {
        return SessionManager.requireRole()(req, res, () => {
            UserController.getProfile(req, res);
        });
    }

    // CRUD Admin (Only Master Admin)
    if (pathname.startsWith('/api/users/admin')) {
        return SessionManager.requireRole(['admin'])(req, res, () => {
            if (pathname === '/api/users/admin' && req.method === 'GET') return UserController.listAdmin(req, res);
            if (pathname === '/api/users/admin/create' && req.method === 'POST') return UserController.createAdmin(req, res);
            if (pathname === '/api/users/admin/update' && req.method === 'POST') return UserController.updateAdmin(req, res);
            if (pathname === '/api/users/admin/delete' && req.method === 'GET') return UserController.deleteAdmin(req, res);
        });
    }

    // ----- STATIC FILE SERVING -----
    let staticPath;
    if (pathname.endsWith('.html') || pathname === '/') {
        let viewFile = pathname === '/' ? 'login.html' : pathname;
        
        // Default views for dashboard roots
        if (viewFile === '/dashboard_admin' || viewFile === '/dashboard_admin/') {
            viewFile = '/dashboard_admin/index.html';
        }
        if (viewFile === '/dashboard_siswa' || viewFile === '/dashboard_siswa/') {
            viewFile = '/dashboard_siswa/index.html';
        }

        // Protect dashboard routes
        if (viewFile.startsWith('/dashboard')) {
            const session = SessionManager.getSession(req);
            if (!session) {
                res.writeHead(302, { 'Location': '/login.html' });
                return res.end();
            }
            
            // Check roles
            if (viewFile.includes('dashboard_admin') && !['admin', 'petugas'].includes(session.role)) {
                res.writeHead(302, { 'Location': '/dashboard_siswa/histori.html' });
                return res.end();
            }
            if (viewFile.includes('dashboard_siswa') && session.role !== 'siswa') {
                res.writeHead(302, { 'Location': '/dashboard_admin/histori.html' });
                return res.end();
            }
        }
        
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
