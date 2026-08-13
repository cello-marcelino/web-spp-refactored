const db = require('../config/database');

class UserRepo {
    // ================= SISWA CRUD =================
    static getAllSiswa() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id_siswa as id, nama_siswa, kelas, jurusan, no_spp, nisn, username, role FROM tb_siswa ORDER BY id_siswa DESC`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static getSiswaById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id_siswa as id, nama_siswa, kelas, jurusan, no_spp, nisn, username, role FROM tb_siswa WHERE id_siswa = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static createSiswa(data) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tb_siswa (nama_siswa, kelas, jurusan, no_spp, nisn, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [data.nama_siswa, data.kelas, data.jurusan, data.no_spp, data.nisn, data.username, data.password, 'siswa'], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    static updateSiswa(id, data) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE tb_siswa SET nama_siswa = ?, kelas = ?, jurusan = ?, no_spp = ?, nisn = ?, username = ?`;
            const params = [data.nama_siswa, data.kelas, data.jurusan, data.no_spp, data.nisn, data.username];
            
            if (data.password) {
                sql += `, password = ?`;
                params.push(data.password);
            }
            sql += ` WHERE id_siswa = ?`;
            params.push(id);

            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    static deleteSiswa(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM tb_siswa WHERE id_siswa = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    // ================= ADMIN CRUD =================
    static getAllAdmin() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT id, nama, email, username, role FROM tb_admin ORDER BY id DESC`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static createAdmin(data) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tb_admin (nama, email, username, password, role) VALUES (?, ?, ?, ?, ?)`;
            db.run(sql, [data.nama, data.email, data.username, data.password, data.role], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    static updateAdmin(id, data) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE tb_admin SET nama = ?, email = ?, username = ?, role = ?`;
            const params = [data.nama, data.email, data.username, data.role];
            
            if (data.password) {
                sql += `, password = ?`;
                params.push(data.password);
            }
            sql += ` WHERE id = ?`;
            params.push(id);

            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    static deleteAdmin(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM tb_admin WHERE id = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    /**
     * Get aggregate stats for the school (Siswa landing page)
     */
    static getSchoolStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    t.jurusan,
                    t.nominal,
                    COUNT(s.id_siswa) as jumlah_siswa
                FROM tb_tarif t
                LEFT JOIN tb_siswa s ON t.jurusan = s.jurusan
                GROUP BY t.jurusan
            `;
            db.all(query, [], (err, rows) => {
                if (err) return reject(err);
                let totalSiswa = 0;
                rows.forEach(r => totalSiswa += r.jumlah_siswa);
                resolve({ totalSiswa, jurusanStats: rows });
            });
        });
    }

    /**
     * Jurusan & Tarif Management
     */
    static getAllTarif() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM tb_tarif ORDER BY jurusan ASC`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static addTarif(jurusan, nominal) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO tb_tarif (jurusan, nominal) VALUES (?, ?)`, [jurusan, nominal], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    static editTarif(oldJurusan, newJurusan, nominal) {
        return new Promise((resolve, reject) => {
            // Must update both tb_tarif and also cascade to tb_siswa? 
            // In a real app we'd cascade. For now, let's just update tb_tarif.
            db.serialize(() => {
                db.run(`UPDATE tb_tarif SET jurusan = ?, nominal = ? WHERE jurusan = ?`, [newJurusan, nominal, oldJurusan], (err) => {
                    if (err) return reject(err);
                    // Also update tb_siswa to match new jurusan name if changed
                    if (oldJurusan !== newJurusan) {
                        db.run(`UPDATE tb_siswa SET jurusan = ? WHERE jurusan = ?`, [newJurusan, oldJurusan]);
                    }
                    resolve(true);
                });
            });
        });
    }

    static removeTarif(jurusan) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM tb_tarif WHERE jurusan = ?`, [jurusan], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
}

module.exports = UserRepo;
