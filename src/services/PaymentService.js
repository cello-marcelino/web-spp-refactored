const PaymentRepo = require('../repositories/PaymentRepo');
const UploadHandler = require('../utils/UploadHandler');

class PaymentService {
    /**
     * Business logic for submitting a payment.
     * @param {Object} paymentData - Form fields
     * @param {Object} fileData - Uploaded receipt file from formidable
     */
    static async processPaymentSubmission(paymentData, fileData) {
        try {
            // 1. Process and save the uploaded file securely
            const secureFilename = UploadHandler.processUpload(fileData);

            // 2. Map data for repository
            const record = {
                nama_siswa: paymentData.nama_siswa,
                kelas: paymentData.kelas,
                jurusan: paymentData.jurusan,
                nisn: paymentData.nisn,
                no_spp: paymentData.no_spp,
                receipt_file: secureFilename,
                tgl_bayar: paymentData.tgl_bayar || new Date().toISOString().split('T')[0],
                bulan_spp: paymentData.bulan_spp,
                nominal: parseInt(paymentData.nominal, 10)
            };

            // Basic validation
            if (!record.nama_siswa || !record.nisn || !record.nominal) {
                throw new Error("Data tidak lengkap.");
            }

            // 3. Save to database
            const insertId = await PaymentRepo.createPayment(record);
            return { success: true, message: 'Pembayaran berhasil disubmit.', id: insertId };

        } catch (error) {
            console.error('[PaymentService] Error submitting payment:', error);
            throw new Error(error.message || 'Gagal memproses pembayaran.');
        }
    }

    /**
     * Business logic for updating payment status (Admin/Petugas only)
     * @param {number} idPembayaran 
     * @param {string} action 'konfirmasi' or 'tolak'
     */
    static async processStatusUpdate(idPembayaran, action) {
        try {
            let newStatus = '';
            if (action === 'konfirmasi') {
                newStatus = 'success';
            } else if (action === 'tolak') {
                newStatus = 'rejected';
            } else {
                throw new Error('Aksi tidak valid.');
            }

            const changes = await PaymentRepo.updateStatus(idPembayaran, newStatus);
            if (changes === 0) {
                throw new Error('Pembayaran tidak ditemukan.');
            }

            return { success: true, message: `Status pembayaran diubah menjadi ${newStatus}.` };
        } catch (error) {
            console.error('[PaymentService] Error updating status:', error);
            throw new Error(error.message || 'Gagal mengubah status pembayaran.');
        }
    }
    /**
     * Get history for admin
     */
    static async getAdminHistory() {
        return await PaymentRepo.getAllPayments();
    }

    /**
     * Get history for siswa
     */
    static async getSiswaHistory(nisn) {
        if (!nisn) throw new Error("NISN tidak valid.");
        return await PaymentRepo.getPaymentsByNisn(nisn);
    }
}

module.exports = PaymentService;
