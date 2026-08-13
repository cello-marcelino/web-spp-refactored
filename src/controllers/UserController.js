const formidable = require('formidable');
const UserService = require('../services/UserService');

class UserController {
    // Helper to parse multipart natively
    static parseForm(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields) => {
                if (err) return reject(err);
                
                // Flatten array values
                const data = {};
                for (let key in fields) {
                    data[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                }
                resolve(data);
            });
        });
    }

    // ================= PROFILE =================
    static async getProfile(req, res) {
        try {
            const session = req.session;
            let data = null;

            if (session.role === 'siswa') {
                const UserRepo = require('../repositories/UserRepo');
                data = await UserRepo.getSiswaById(session.id);
            } else {
                data = {
                    id: session.id,
                    username: session.username,
                    nama_lengkap: session.nama_lengkap,
                    role: session.role
                };
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }

    // ================= SISWA =================
    static async listSiswa(req, res) {
        try {
            const data = await UserService.getSiswaList();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }

    static async createSiswa(req, res) {
        try {
            const data = await UserController.parseForm(req);
            await UserService.addSiswa(data);
            res.writeHead(302, { 'Location': '/dashboard_admin/data_siswa.html?msg=created' });
            res.end();
        } catch (error) {
            res.writeHead(302, { 'Location': `/dashboard_admin/data_siswa.html?error=${encodeURIComponent(error.message)}` });
            res.end();
        }
    }

    static async updateSiswa(req, res) {
        try {
            const data = await UserController.parseForm(req);
            const id = parseInt(data.id, 10);
            await UserService.editSiswa(id, data);
            res.writeHead(302, { 'Location': '/dashboard_admin/data_siswa.html?msg=updated' });
            res.end();
        } catch (error) {
            res.writeHead(302, { 'Location': `/dashboard_admin/data_siswa.html?error=${encodeURIComponent(error.message)}` });
            res.end();
        }
    }

    static async deleteSiswa(req, res) {
        try {
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const id = parseInt(urlObj.searchParams.get('id'), 10);
            await UserService.removeSiswa(id);
            res.writeHead(302, { 'Location': '/dashboard_admin/data_siswa.html?msg=deleted' });
            res.end();
        } catch (error) {
            res.writeHead(302, { 'Location': `/dashboard_admin/data_siswa.html?error=${encodeURIComponent(error.message)}` });
            res.end();
        }
    }

    // ================= ADMIN =================
    static async listAdmin(req, res) {
        try {
            const data = await UserService.getAdminList();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }

    static async createAdmin(req, res) {
        try {
            const data = await UserController.parseForm(req);
            await UserService.addAdmin(data);
            res.writeHead(302, { 'Location': '/dashboard_admin/data_admin.html?msg=created' });
            res.end();
        } catch (error) {
            res.writeHead(302, { 'Location': `/dashboard_admin/data_admin.html?error=${encodeURIComponent(error.message)}` });
            res.end();
        }
    }

    static async updateAdmin(req, res) {
        try {
            const data = await UserController.parseForm(req);
            const id = parseInt(data.id, 10);
            await UserService.editAdmin(id, data);
            res.writeHead(302, { 'Location': '/dashboard_admin/data_admin.html?msg=updated' });
            res.end();
        } catch (error) {
            res.writeHead(302, { 'Location': `/dashboard_admin/data_admin.html?error=${encodeURIComponent(error.message)}` });
            res.end();
        }
    }

    static async deleteAdmin(req, res) {
        try {
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const id = parseInt(urlObj.searchParams.get('id'), 10);
            await UserService.removeAdmin(id);
            res.writeHead(302, { 'Location': '/dashboard_admin/data_admin.html?msg=deleted' });
            res.end();
        } catch (error) {
            res.writeHead(302, { 'Location': `/dashboard_admin/data_admin.html?error=${encodeURIComponent(error.message)}` });
            res.end();
        }
    }

    static async getSchoolStats(req, res) {
        try {
            const UserRepo = require('../repositories/UserRepo');
            const stats = await UserRepo.getSchoolStats();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(stats));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
}

module.exports = UserController;
