const bcrypt = require('bcrypt');
const UserRepo = require('../repositories/UserRepo');

const SALT_ROUNDS = 10;

class UserService {
    // ================= SISWA =================
    static async getSiswaList() {
        return await UserRepo.getAllSiswa();
    }

    static async addSiswa(data) {
        if (!data.username || !data.password || !data.nama_siswa) {
            throw new Error('Data wajib (username, password, nama) harus diisi.');
        }
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        return await UserRepo.createSiswa(data);
    }

    static async editSiswa(id, data) {
        if (data.password && data.password.trim() !== '') {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        } else {
            delete data.password; // Do not update password if empty
        }
        const changes = await UserRepo.updateSiswa(id, data);
        if (changes === 0) throw new Error('Siswa tidak ditemukan.');
        return changes;
    }

    static async removeSiswa(id) {
        const changes = await UserRepo.deleteSiswa(id);
        if (changes === 0) throw new Error('Siswa tidak ditemukan.');
        return changes;
    }

    // ================= ADMIN =================
    static async getAdminList() {
        return await UserRepo.getAllAdmin();
    }

    static async addAdmin(data) {
        if (!data.username || !data.password || !data.nama) {
            throw new Error('Data wajib (username, password, nama) harus diisi.');
        }
        if (!['admin', 'petugas'].includes(data.role)) {
            data.role = 'petugas';
        }
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        return await UserRepo.createAdmin(data);
    }

    static async editAdmin(id, data) {
        if (data.password && data.password.trim() !== '') {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        } else {
            delete data.password;
        }
        const changes = await UserRepo.updateAdmin(id, data);
        if (changes === 0) throw new Error('Admin tidak ditemukan.');
        return changes;
    }

    static async removeAdmin(id) {
        const changes = await UserRepo.deleteAdmin(id);
        if (changes === 0) throw new Error('Admin tidak ditemukan.');
        return changes;
    }
}

module.exports = UserService;
