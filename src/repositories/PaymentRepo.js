const db = require('../config/database');

class PaymentRepo {
    /**
     * Creates a new payment record in the database.
     * @param {Object} data 
     * @returns {Promise<number>} Inserted ID
     */
    static createPayment(data) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO pembayaran 
                (nama_siswa, kelas, jurusan, nisn, no_spp, receipt_file, tgl_bayar, bulan_spp, nominal, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                data.nama_siswa,
                data.kelas,
                data.jurusan,
                data.nisn,
                data.no_spp,
                data.receipt_file,
                data.tgl_bayar,
                data.bulan_spp,
                data.nominal,
                'pending' // always pending on creation
            ];

            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    /**
     * Updates the status of an existing payment.
     * @param {number} idPembayaran 
     * @param {string} status 'success' | 'rejected'
     * @returns {Promise<number>} Number of changed rows
     */
    static updateStatus(idPembayaran, status) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE pembayaran SET status = ? WHERE id_pembayaran = ?`;
            
            db.run(sql, [status, idPembayaran], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    /**
     * Retrieves all payments for admin/petugas view.
     */
    static getAllPayments() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM pembayaran ORDER BY id_pembayaran DESC`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = PaymentRepo;
