const bcrypt = require('bcrypt');
const AuthRepo = require('../repositories/AuthRepo');
const SessionManager = require('../utils/SessionManager');

class AuthService {
    /**
     * Authenticates a user and creates a session.
     * @param {string} username 
     * @param {string} password 
     * @param {Object} res HTTP Response to set cookie
     * @returns {Promise<Object>} Redirection path and user data
     */
    static async login(username, password, res) {
        try {
            const user = await AuthRepo.findUserByUsername(username);
            
            if (!user) {
                throw new Error('Username atau password salah.');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                throw new Error('Username atau password salah.');
            }

            // Valid, create session
            const userData = {
                id: user.id,
                username: user.username,
                role: user.role,
                nama_lengkap: user.nama_lengkap,
                nisn: user.nisn // Undefined for admin, which is fine
            };

            SessionManager.createSession(res, userData);

            // Determine redirect path
            let redirectUrl = '/';
            if (user.role === 'admin' || user.role === 'petugas') {
                redirectUrl = '/dashboard_admin/histori.html';
            } else if (user.role === 'siswa') {
                redirectUrl = '/dashboard_siswa/histori.html';
            }

            return { success: true, redirectUrl, user: userData };
        } catch (error) {
            throw new Error(error.message || 'Gagal login.');
        }
    }
}

module.exports = AuthService;
