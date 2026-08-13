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

    /**
     * Retrieves payments for a specific student using NISN.
     */
    static getPaymentsByNisn(nisn) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM pembayaran WHERE nisn = ? ORDER BY id_pembayaran DESC`;
            db.all(sql, [nisn], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Retrieves statistics for admin dashboard
     */
    static getDashboardStats() {
        return new Promise((resolve, reject) => {
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
            const stats = {
                total_siswa: 0,
                total_pending: 0,
                total_success: 0,
                total_rejected: 0,
                total_revenue: 0,
                paid_this_month: 0,
                unpaid_this_month: 0,
                current_month: currentMonth,
                chart_data: []
            };

            // Get total siswa
            db.get(`SELECT COUNT(id_siswa) as count FROM tb_siswa WHERE role = 'siswa'`, [], (err, row) => {
                if (err) return reject(err);
                stats.total_siswa = row ? row.count : 0;

                // Get summary of payments and total revenue
                db.all(`SELECT status, COUNT(id_pembayaran) as count, SUM(nominal) as revenue FROM pembayaran GROUP BY status`, [], (err, rows) => {
                    if (err) return reject(err);
                    rows.forEach(r => {
                        if (r.status === 'pending') stats.total_pending = r.count;
                        if (r.status === 'success') {
                            stats.total_success = r.count;
                            stats.total_revenue = r.revenue || 0;
                        }
                        if (r.status === 'rejected') stats.total_rejected = r.count;
                    });

                    // Get ratio of paid vs unpaid this month
                    db.get(`SELECT COUNT(DISTINCT nisn) as paid FROM pembayaran WHERE status = 'success' AND bulan_spp = ?`, [currentMonth], (err, rowPaid) => {
                        if (err) return reject(err);
                        stats.paid_this_month = rowPaid ? rowPaid.paid : 0;
                        stats.unpaid_this_month = Math.max(0, stats.total_siswa - stats.paid_this_month);

                        // Get chart data: Ratio of Validated vs Pending vs Rejected per month + Revenue line
                        db.all(`
                            SELECT bulan_spp, 
                                   SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
                                   SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                                   SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
                                   SUM(CASE WHEN status = 'success' THEN nominal ELSE 0 END) as revenue
                            FROM pembayaran 
                            GROUP BY bulan_spp
                            ORDER BY bulan_spp DESC
                            LIMIT 6
                        `, [], (err, chartRows) => {
                            if (err) return reject(err);
                            stats.chart_data = chartRows;
                            resolve(stats);
                        });
                    });
                });
            });
        });
    }
}

module.exports = PaymentRepo;
