const formidable = require('formidable');
const AuthService = require('../services/AuthService');
const SessionManager = require('../utils/SessionManager');

class AuthController {
    /**
     * Handle POST /api/auth/login
     */
    static async login(req, res) {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Gagal memparsing form login.' }));
            }

            try {
                const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
                const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

                if (!username || !password) {
                    throw new Error('Username dan password harus diisi.');
                }

                const result = await AuthService.login(username, password, res);
                
                // Redirect on success
                res.writeHead(302, { 'Location': result.redirectUrl });
                res.end();
            } catch (error) {
                // Redirect back to login with error
                res.writeHead(302, { 'Location': `/login.html?error=${encodeURIComponent(error.message)}` });
                res.end();
            }
        });
    }

    /**
     * Handle GET /api/auth/logout
     */
    static logout(req, res) {
        SessionManager.destroySession(req, res);
        res.writeHead(302, { 'Location': '/login.html' });
        res.end();
    }
}

module.exports = AuthController;
