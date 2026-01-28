/**
 * ssp-mobile-app Core App Logic
 * Main entry point and API communications.
 */

const App = {
    init() {
        console.log("Initializing App...");
        UI.init(); // Render DOM dynamically
        this.initTheme();
        UI.showLoading(1500);

        // Initial nav state
        window.lastActiveView = 'main-scan';
    },

    initTheme() {
        const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
        const logo = document.getElementById('onboarding-logo');
        const loaderImg = document.getElementById('main-loader-img');
        const toggleIcon = document.getElementById('toggle-icon');

        const isDark = (savedTheme !== 'light'); // Default to dark

        if (isDark) {
            document.body.classList.add('dark-mode');
            if (logo) logo.src = CONFIG.ASSETS.LOGO_DARK;
            if (loaderImg) loaderImg.src = CONFIG.ASSETS.LOADER_DARK;
            if (toggleIcon) toggleIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            if (logo) logo.src = CONFIG.ASSETS.LOGO_LIGHT;
            if (loaderImg) loaderImg.src = CONFIG.ASSETS.LOADER_LIGHT;
            if (toggleIcon) toggleIcon.className = 'fas fa-moon';
        }
    },

    async handleScanResult(barcode) {
        console.log("Processing Barcode:", barcode);
        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kode_barcode: barcode })
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const rawText = await response.text();
            console.log("Raw Response:", rawText);

            let res;
            try {
                res = JSON.parse(rawText);
            } catch (jsonErr) {
                console.error("Failed to parse JSON:", jsonErr);
                throw new Error("Respon server bukan format JSON yang valid.");
            }

            if (res.error) {
                alert(res.error);
                UI.switchView('main-scan');
                return;
            }

            UI.populateMemberData(res);
            UI.switchView('profile');
            document.getElementById('main-nav').classList.add('has-member');

        } catch (e) {
            console.error("Connection/API Error:", e);
            alert("Error: " + e.message);
            UI.switchView('main-scan');
        }
    }
};

// --- Theme Toggle Global ---
function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    App.initTheme();
}

// Start the app
document.addEventListener('DOMContentLoaded', () => App.init());
