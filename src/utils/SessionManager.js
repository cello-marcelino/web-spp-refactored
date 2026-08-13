const cookie = require('cookie');

// Simple in-memory session store (In a real app, use Redis or SQLite for session storage)
// Since this is native Node.js and we want to keep it simple as per PRD:
const sessions = new Map();

class SessionManager {
    static createSession(res, userData) {
        const sessionId = require('crypto').randomUUID();
        // Set session expiry to 1 hour
        const expiresAt = Date.now() + 60 * 60 * 1000; 
        
        sessions.set(sessionId, {
            ...userData,
            expiresAt
        });

        const setCookie = cookie.serialize('session_id', sessionId, {
            httpOnly: true,
            maxAge: 60 * 60, // 1 hour
            path: '/',
            sameSite: 'strict',
        });

        res.setHeader('Set-Cookie', setCookie);
        return sessionId;
    }

    static getSession(req) {
        const cookies = cookie.parse(req.headers.cookie || '');
        const sessionId = cookies.session_id;

        if (!sessionId || !sessions.has(sessionId)) {
            return null;
        }

        const session = sessions.get(sessionId);
        if (Date.now() > session.expiresAt) {
            sessions.delete(sessionId); // Expired
            return null;
        }

        return session;
    }

    static requireRole(allowedRoles = []) {
        return (req, res, next) => {
            const session = this.getSession(req);
            
            if (!session) {
                res.writeHead(302, { 'Location': '/login' });
                return res.end();
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Akses ditolak.' }));
            }

            // Bind session to request for downstream use
            req.session = session;
            next();
        };
    }

    static destroySession(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        const sessionId = cookies.session_id;

        if (sessionId) {
            sessions.delete(sessionId);
        }

        const clearCookie = cookie.serialize('session_id', '', {
            httpOnly: true,
            maxAge: -1, // Expire immediately
            path: '/',
        });
        res.setHeader('Set-Cookie', clearCookie);
    }
}

module.exports = SessionManager;
