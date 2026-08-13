const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

class UploadHandler {
    /**
     * Validates and renames the uploaded file.
     * Assumes file is parsed by formidable.
     * @param {Object} file - Formidable file object
     * @returns {string} The secure filename saved.
     * @throws {Error} If validation fails.
     */
    static processUpload(file) {
        if (!file) {
            throw new Error('File receipt tidak ditemukan.');
        }

        const originalName = file.originalFilename || file.name;
        const ext = path.extname(originalName).toLowerCase();

        // 1. Validate Extension
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            throw new Error('Ekstensi file tidak valid. Hanya menerima jpg, jpeg, dan png.');
        }

        // 2. Validate Size
        if (file.size > MAX_FILE_SIZE) {
            throw new Error('Ukuran file terlalu besar. Maksimal 2MB.');
        }

        // 3. Secure Renaming using UUID/Timestamp
        const secureFilename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
        const newPath = path.join(UPLOAD_DIR, secureFilename);

        // 4. Move file to secure location
        fs.copyFileSync(file.filepath, newPath);
        fs.rmSync(file.filepath, { force: true }); // cleanup temp file

        return secureFilename;
    }
}

module.exports = UploadHandler;
