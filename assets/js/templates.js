/**
 * ssp-mobile-app Templates Module
 * Contains the raw HTML strings for application components.
 */

const TEMPLATES = {
    root: `
        <!-- GLOBAL LOADER -->
        <div id="global-loader">
            <img id="main-loader-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Loading...">
        </div>

        <!-- THEME TOGGLE -->
        <button class="dark-mode-toggle" onclick="toggleDarkMode()">
            <i class="fas fa-moon" id="toggle-icon"></i>
        </button>

        <div class="app-container" id="main-app-container">
            <!-- Content will be injected here -->
        </div>

        <!-- MODERN NAVIGATION BAR -->
        <div class="modern-nav" id="main-nav">
            <a href="javascript:void(0)" class="nav-item" id="nav-btn-profile" onclick="UI.switchView('profile')">
                <i class="fas fa-store"></i><span>TOKO</span>
            </a>
            <div class="scan-fab-wrapper">
                <div class="scan-fab" onclick="openScanner()">
                    <i class="fas fa-qrcode"></i><span>SCAN</span>
                </div>
            </div>
            <a href="javascript:void(0)" class="nav-item" id="nav-btn-scan" onclick="UI.switchView('scan')">
                <i class="fas fa-receipt"></i><span>RIWAYAT</span>
            </a>
        </div>

        <!-- MODALS & OVERLAYS -->
        <div id="view-scan-camera">
            <div class="scanner-top-bar">
                <span style="color: white; font-weight: 700; font-size: 18px;">Pindai QR</span>
                <button class="btn-cam-cancel" onclick="cancelScanner()">BATAL</button>
            </div>
            <div id="reader" style="width: 100%; height: 100%;"></div>
            <div class="scanner-overlay-android">
                <div class="scanner-box">
                    <div class="scanner-line"></div>
                    <div class="scanner-corner tl"></div>
                    <div class="scanner-corner tr"></div>
                    <div class="scanner-corner bl"></div>
                    <div class="scanner-corner br"></div>
                </div>
                <p class="scanner-instruction">Posisikan QR di dalam kotak</p>
            </div>
            
            <!-- Upload QR Image Button - Bottom Left like Camera Gallery -->
            <div class="upload-qr-section">
                <input type="file" id="qr-image-input" accept="image/*" style="display: none;" onchange="scanFromImage(this)">
                <button class="btn-upload-qr" onclick="document.getElementById('qr-image-input').click()" title="Upload Gambar QR">
                    <i class="fas fa-image"></i>
                </button>
            </div>
        </div>

        <div id="imagePreviewModal" class="touch-preview-modal">
            <div class="modal-header">
                <span id="previewTitle">Preview</span>
                <button class="btn-cam-cancel" onclick="closeImagePreview()">TUTUP</button>
            </div>
            <div id="previewWrap">
                <img id="previewImage" src="" alt="Preview">
            </div>
        </div>
    `,

    onboarding: `
        <div id="view-main-scan" class="view-content active" style="padding-top: 20px;">
            <div class="onboarding-header">
                <img src="assets/img/ssp-logo-dark.png" id="onboarding-logo" alt="Sundava" style="width: 200px;">
                <h1>Selamat Datang.</h1>
                <p style="color: var(--text-muted);">Gunakan fitur scan untuk memantau data toko & transaksi secara real-time.</p>
            </div>

            <div class="m3-card" style="padding: 16px 20px;">
                <span class="card-label" style="margin-bottom: 12px;">Langkah Cepat</span>
                <div class="step-item">
                    <div class="step-icon">1</div>
                    <div class="step-text">Ketuk tombol <b>SCAN</b> di bar bawah.</div>
                </div>
                <div class="step-item">
                    <div class="step-icon">2</div>
                    <div class="step-text">Arahkan kamera ke <b>QR Code</b> kios.</div>
                </div>
                <div class="step-item">
                    <div class="step-icon">3</div>
                    <div class="step-text">Data akan muncul secara otomatis.</div>
                </div>
            </div>
        </div>
    `,

    profile: `
        <div id="view-profile" class="view-content" style="padding-top: 20px;">
            <div class="m3-card" style="padding: 0; position: relative;">
                <img id="member-banner-img" src="assets/img/default-shop.jpg" onclick="openImagePreview(this.src, 'Toko')" class="banner-img">
                <div id="member-logo-container" class="logo-container">
                    <img id="member-logo-img" src="assets/img/logo-small.png" onclick="event.stopPropagation(); openImagePreview(this.src, 'Logo')" class="logo-img">
                </div>
            </div>

            <div class="profile-title-section">
                <h1 id="shop-name">...</h1>
                <p class="shop-address-line">
                    <i class="fas fa-map-marker-alt"></i> <span id="shop-address">...</span>
                </p>
            </div>

            <div class="m3-card">
                <span class="card-label">Kontak Utama</span>
                <div class="contact-section">
                    <img id="member-profile-img" src="assets/img/users-profile.jpeg" onclick="openImagePreview(this.src, 'Pemilik')" class="profile-avatar">
                    <div class="contact-info">
                        <h4 id="owner-name">...</h4>
                        <p class="wa-link"><i class="fab fa-whatsapp"></i> <span id="owner-wa">...</span></p>
                    </div>
                </div>
            </div>

            <div class="m3-card">
                <span class="card-label">Produk SDV</span>
                <div id="product-list-container"></div>
            </div>

            <div class="m3-card">
                <span class="card-label">Sumber Produk</span>
                <div id="source-list-container"></div>
            </div>

            <div class="m3-card">
                <span class="card-label">Petugas Pendamping</span>
                <div id="officer-list-container"></div>
            </div>

            <div class="m3-card">
                <span class="card-label">Total Produk Diterima</span>
                <div id="profile-history-container"></div>
                <div style="text-align: center; margin-top: 15px;">
                    <button class="btn-cam-cancel" style="background: var(--primary-light); color: var(--primary); width: 100%;" onclick="UI.switchView('scan')">LIHAT SEMUA</button>
                </div>
            </div>
        </div>
    `,

    orders: `
        <div id="view-scan" class="view-content">
            <!-- Dynamic Content via UI.renderOrders -->
        </div>
    `
};
