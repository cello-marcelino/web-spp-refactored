const formidable = require('formidable');
const PaymentService = require('../services/PaymentService');

class PaymentController {
    /**
     * Handle POST request from Siswa to submit payment.
     */
    static async submitPayment(req, res) {
        const form = new formidable.IncomingForm({
            multiples: false,
            keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Gagal memparsing form.' }));
            }

            try {
                const session = req.session;
                // Force using the logged-in student's exact Name and NISN
                const paymentData = {
                    nama_siswa: session.nama_lengkap,
                    kelas: Array.isArray(fields.kelas) ? fields.kelas[0] : fields.kelas,
                    jurusan: Array.isArray(fields.jurusan) ? fields.jurusan[0] : fields.jurusan,
                    nisn: session.nisn, 
                    no_spp: Array.isArray(fields.no_spp) ? fields.no_spp[0] : fields.no_spp,
                    tgl_bayar: Array.isArray(fields.tgl_bayar) ? fields.tgl_bayar[0] : fields.tgl_bayar,
                    bulan_spp: Array.isArray(fields.bulan_spp) ? fields.bulan_spp[0] : fields.bulan_spp,
                    nominal: Array.isArray(fields.nominal) ? fields.nominal[0] : fields.nominal,
                };

                const receiptFile = Array.isArray(files.receipt) ? files.receipt[0] : files.receipt;

                const result = await PaymentService.processPaymentSubmission(paymentData, receiptFile);
                
                // Redirect back to history page on success
                res.writeHead(302, { 'Location': '/dashboard_siswa/histori.html?msg=success' });
                res.end();
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }

    /**
     * Handle GET request from Admin/Petugas to update payment status.
     * Expects query params: ?action=konfirmasi&id=123
     */
    static async updatePaymentStatus(req, res) {
        try {
            // Very basic query string parsing for native node
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const action = urlObj.searchParams.get('action'); // 'konfirmasi' or 'tolak'
            const id = parseInt(urlObj.searchParams.get('id'), 10);

            if (!action || isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Parameter tidak valid.' }));
            }

            await PaymentService.processStatusUpdate(id, action);
            
            // Redirect back to admin history page
            res.writeHead(302, { 'Location': '/dashboard_admin/histori.html?msg=updated' });
            res.end();
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle GET request for history data (JSON).
     */
    static async getHistory(req, res) {
        try {
            const session = req.session; // Attached by middleware
            let data = [];

            if (session.role === 'siswa') {
                data = await PaymentService.getSiswaHistory(session.nisn);
            } else if (session.role === 'admin' || session.role === 'petugas') {
                data = await PaymentService.getAdminHistory();
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }

    /**
     * Handle GET request for dashboard statistics (Admin only)
     */
    static async getStatistics(req, res) {
        try {
            const stats = await require('../repositories/PaymentRepo').getDashboardStats();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(stats));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
}

module.exports = PaymentController;
