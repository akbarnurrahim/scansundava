/**
 * ssp-mobile-app UI Helper Module
 * Handles view switching, modals, and dynamic content rendering.
 */

const UI = {
    // Inject all templates into the root element
    init() {
        const root = document.getElementById('app-root');
        if (!root) return;

        // Initial core structure
        root.innerHTML = TEMPLATES.root;

        // Inject views into app-container
        const container = document.getElementById('main-app-container');
        if (container) {
            container.innerHTML = TEMPLATES.onboarding + TEMPLATES.profile + TEMPLATES.orders;
        }

        // Setup image preview listeners (moved from global for performance)
        this.setupImagePreview();
    },

    // Switch between app views
    switchView(viewName) {
        if (viewName !== 'scan-camera') {
            Scanner.stop();
            // Store as last view
            window.lastActiveView = viewName;
        }

        document.querySelectorAll('.view-content').forEach(el => el.classList.remove('active'));
        document.getElementById('view-scan-camera').style.display = 'none';

        // Update Nav Active State
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        if (viewName === 'profile') {
            document.getElementById('nav-btn-profile').classList.add('active');
        } else if (viewName === 'scan') {
            document.getElementById('nav-btn-scan').classList.add('active');
        }

        if (viewName === 'scan-camera') {
            document.getElementById('view-scan-camera').style.display = 'flex';
            return;
        }

        const targetView = document.getElementById('view-' + viewName);
        if (targetView) targetView.classList.add('active');

        if (viewName === 'main-scan') {
            document.getElementById('main-nav').classList.remove('has-member');
        }

        window.scrollTo(0, 0);
    },

    // Show/Hide Global Loader
    showLoading(ms, callback) {
        const loader = document.getElementById('global-loader');
        const loaderImg = document.getElementById('main-loader-img');
        const isDark = document.body.classList.contains('dark-mode');

        if (loaderImg) {
            loaderImg.src = isDark ? CONFIG.ASSETS.LOADER_DARK : CONFIG.ASSETS.LOADER_LIGHT;
        }

        loader.style.display = 'flex';
        loader.style.opacity = '1';

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (callback) callback();
            }, 500);
        }, ms);
    },

    // Populate Member Profile UI
    populateMemberData(data) {
        const member = data.member;
        const orders = data.orders || [];  // Safety: default to empty array
        const products = member.products || [];  // Get from member object
        const sources = member.sources || [];    // Get from member object

        // Basic Info
        document.getElementById('shop-name').innerText = member.nama_toko;
        document.getElementById('owner-name').innerText = member.nama_member;
        document.getElementById('shop-address').innerText = member.alamat || 'Alamat tidak tersedia';
        document.getElementById('owner-wa').innerText = member.nomor_handphone || '-';

        // Photos - Use absolute URLs
        const API_BASE = 'https://api.sundava.cloud/api/v1/';
        const bannerImg = document.getElementById('member-banner-img');
        if (bannerImg) bannerImg.src = member.foto_toko ? API_BASE + member.foto_toko : CONFIG.ASSETS.DEFAULT_SHOP;

        const logoContainer = document.getElementById('member-logo-container');
        const logoImg = document.getElementById('member-logo-img');
        if (member.logo_toko) {
            if (logoContainer) logoContainer.style.display = 'block';
            if (logoImg) logoImg.src = API_BASE + member.logo_toko;
        } else {
            if (logoContainer) logoContainer.style.display = 'none';
        }

        const profileImg = document.getElementById('member-profile-img');
        if (profileImg) profileImg.src = member.foto_profil ? API_BASE + member.foto_profil : CONFIG.ASSETS.DEFAULT_AVATAR;

        // Render Lists - Extract names from objects
        const productNames = products.map(p => p.nama_produk || p);
        const sourceNames = sources.map(s => s.nama_sumber || s);
        this.renderGenericList('product-list-container', productNames, 'Belum ada produk yang ditugaskan.');
        this.renderGenericList('source-list-container', sourceNames, 'Belum ada sumber barang yang ditugaskan.');

        // Render Pendamping
        const pendampingName = member.pendamping ? member.pendamping.nama_pendamping : null;
        const pendamping = pendampingName ? [pendampingName] : [];
        this.renderGenericList('officer-list-container', pendamping, 'Petugas belum ditugaskan.');

        // Render Orders in two places
        this.renderOrders(orders);
        this.renderProfileHistory(orders);
    },

    renderProfileHistory(orders) {
        const container = document.getElementById('profile-history-container');
        if (!container) return;

        if (orders && orders.length > 0) {
            // Only show latest 3 on profile
            const latest = orders.slice(0, 3);
            let html = '';
            latest.forEach(o => {
                html += `
                    <div class="order-item-android" style="padding: 12px; margin-bottom: 8px;">
                        <div style="flex: 1;">
                            <h4 style="font-size: 14px; margin: 0;">${o.produk}</h4>
                            <p style="font-size:11px; margin:0; opacity:0.6;">${this.formatDate(o.tanggal)}</p>
                        </div>
                        <div class="order-qty-pill" style="font-size: 11px;">${o.quantity_box} DUS</div>
                    </div>`;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="text-muted small">Belum ada riwayat PO.</p>';
        }
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    renderGenericList(containerId, items, emptyMsg) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        if (items.length > 0) {
            items.forEach(item => {
                container.innerHTML += `
                    <div class="detail-row">
                        <div class="product-dot"></div>
                        <div class="detail-info"><span>${item}</span></div>
                    </div>`;
            });
        } else {
            container.innerHTML = `<p class="text-muted small">${emptyMsg}</p>`;
        }
    },

    renderOrders(orders) {
        const container = document.getElementById('view-scan');
        if (!container) return;

        let html = '<div class="m3-card"><span class="card-label">Total PO Diterima</span>';
        if (orders && orders.length > 0) {
            html += orders.map(o => `
                <div class="order-item-android">
                    <div style="flex: 1;">
                        <h4 style="font-size: 16px; margin: 0;">${o.produk}</h4>
                        <p style="font-size:12px; margin:0; opacity:0.7;">Sumber: ${o.sumber_barang}</p>
                        <p style="font-size:11px; margin:2px 0 0 0; color: var(--primary); font-weight: 600;">Terakhir: ${this.formatDate(o.tanggal)}</p>
                    </div>
                    <div class="order-qty-pill">${o.quantity_box} DUS</div>
                </div>
            `).join('');
        } else {
            html += '<p class="text-center py-3">Belum ada riwayat PO.</p>';
        }
        html += '</div>';
        container.innerHTML = html;
    },
    setupImagePreview() {
        const previewWrap = document.getElementById('previewWrap');
        if (!previewWrap) return;

        previewWrap.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isPanning = true;
                startX = e.touches[0].clientX - pointX;
                startY = e.touches[0].clientY - pointY;
            } else if (e.touches.length === 2) {
                isPanning = false;
                lastScale = previewScale;
            }
        });

        previewWrap.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isPanning) {
                pointX = e.touches[0].clientX - startX;
                pointY = e.touches[0].clientY - startY;
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                if (!previewWrap.lastDist) previewWrap.lastDist = dist;
                previewScale = Math.min(Math.max(1, lastScale * (dist / previewWrap.lastDist)), 5);
            }
            updatePreviewTransform();
        });

        previewWrap.addEventListener('touchend', (e) => {
            isPanning = false;
            previewWrap.lastDist = 0;
        });
    }
};

// --- Image Preview Logic (Zoom/Pan) ---
let previewScale = 1, lastScale = 1, pointX = 0, pointY = 0, startX = 0, startY = 0, isPanning = false;

function openImagePreview(src, title) {
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    img.src = src;
    document.getElementById('previewTitle').innerText = title;
    modal.style.display = 'flex';
    previewScale = 1; pointX = 0; pointY = 0;
    updatePreviewTransform();
}

function closeImagePreview() {
    document.getElementById('imagePreviewModal').style.display = 'none';
}

function updatePreviewTransform() {
    const img = document.getElementById('previewImage');
    if (img) img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${previewScale})`;
}
