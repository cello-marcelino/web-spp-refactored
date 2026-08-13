// public/js/components/sidebar.js
class SidebarComponent {
    /**
     * @param {string} role - 'siswa' | 'admin' | 'petugas'
     * @param {string} activePath - The current path to highlight
     */
    static render(role, activePath) {
        const root = document.getElementById('sidebar-root');
        if (!root) return;

        let links = [];

        if (role === 'siswa') {
            links = [
                { path: '/dashboard_siswa/histori.html', label: 'Riwayat Pembayaran' },
                { path: '/dashboard_siswa/form_pembayaran.html', label: 'Bayar SPP' }
            ];
        } else if (role === 'admin' || role === 'petugas') {
            links = [
                { path: '/dashboard_admin/histori.html', label: 'Validasi Pembayaran' }
                // Tambahkan link Data Siswa dll nanti
            ];
        }

        const navHtml = links.map(link => `
            <a href="${link.path}" class="nav-link ${activePath.includes(link.path) ? 'active' : ''}">
                ${link.label}
            </a>
        `).join('');

        const template = `
            <aside class="sidebar">
                <div class="sidebar-header">
                    SPP Pay
                </div>
                <nav>
                    ${navHtml}
                    <a href="/logout" class="nav-link" style="color: var(--danger); margin-top: auto;">Logout</a>
                </nav>
            </aside>
        `;

        root.innerHTML = template;
    }
}
