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
                { path: '/dashboard_siswa/index.html', label: 'Beranda' },
                { path: '/dashboard_siswa/histori.html', label: 'Riwayat Pembayaran' },
                { path: '/dashboard_siswa/form_pembayaran.html', label: 'Bayar SPP' }
            ];
        } else if (role === 'admin' || role === 'petugas') {
            links = [
                { path: '/dashboard_admin/index.html', label: 'Dashboard Statistik' },
                { path: '/dashboard_admin/histori.html', label: 'Validasi Pembayaran' },
                { path: '/dashboard_admin/data_siswa.html', label: 'Data Siswa' }
            ];
            
            if (role === 'admin') {
                links.push({ path: '/dashboard_admin/data_jurusan.html', label: 'Data Jurusan & Tarif' });
                links.push({ path: '/dashboard_admin/data_admin.html', label: 'Data Admin' });
            }
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
                </nav>
            </aside>
        `;

        root.innerHTML = template;
        
        // Remove the hardcoded inline style that messes up layout
        root.removeAttribute("style");

        // Inject Topbar automatically to main-content
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !document.querySelector('.topbar')) {
            const topbarHtml = `
                <div class="topbar">
                    <div style="flex: 1; font-weight: 600; color: var(--primary);">SPP PAY System</div>
                    <div class="topbar-menu">
                        <a href="${role === 'siswa' ? '/dashboard_siswa/profil.html' : '/dashboard_admin/profil.html'}">
                            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            <span>Profil</span>
                        </a>
                        <a href="/logout" style="color: var(--danger);">
                            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            <span>Logout</span>
                        </a>
                    </div>
                </div>
            `;
            mainContent.insertAdjacentHTML('afterbegin', topbarHtml);
        }
    }
}
