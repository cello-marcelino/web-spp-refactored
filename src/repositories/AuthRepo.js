const db = require('../config/database');

class AuthRepo {
    /**
     * Finds a user in either tb_siswa or tb_admin by username.
     * @param {string} username 
     * @returns {Promise<Object|null>} The user record or null if not found
     */
    static findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            // First check admin/petugas
            const sqlAdmin = `SELECT id, nama as nama_lengkap, username, password, role FROM tb_admin WHERE username = ?`;
            db.get(sqlAdmin, [username], (err, adminRow) => {
                if (err) return reject(err);
                if (adminRow) {
                    return resolve({ ...adminRow, type: 'admin' });
                }

                // If not found in admin, check siswa
                const sqlSiswa = `SELECT id_siswa as id, nama_siswa as nama_lengkap, username, password, role, nisn FROM tb_siswa WHERE username = ?`;
                db.get(sqlSiswa, [username], (err, siswaRow) => {
                    if (err) return reject(err);
                    if (siswaRow) {
                        return resolve({ ...siswaRow, type: 'siswa' });
                    }

                    // Not found in both
                    resolve(null);
                });
            });
        });
    }
}

module.exports = AuthRepo;
