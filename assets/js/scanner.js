/**
 * ssp-mobile-app Scanner Module
 * Wraps Html5Qrcode library for easy usage.
 */

const Scanner = {
    instance: null,

    async start(onSuccess) {
        console.log("Starting scanner...");

        try {
            if (!this.instance) {
                this.instance = new Html5Qrcode("reader");
            }

            const config = {
                fps: CONFIG.SCANNER.FPS,
                qrbox: { width: CONFIG.SCANNER.QRBOX_SIZE, height: CONFIG.SCANNER.QRBOX_SIZE }
            };

            await this.instance.start(
                { facingMode: "environment" },
                config,
                onSuccess
            );
        } catch (err) {
            console.error("Scanner Error:", err);
            throw err;
        }
    },

    async stop() {
        if (this.instance && this.instance.isScanning) {
            await this.instance.stop();
            this.instance.clear();
        }
        document.getElementById('view-scan-camera').style.display = 'none';
    }
};

/**
 * Global handlers for UI buttons
 */
function openScanner() {
    UI.switchView('scan-camera');
    Scanner.start((decodedText) => {
        console.log("QR Decoded:", decodedText);
        Scanner.stop().then(() => {
            UI.showLoading(2000, () => App.handleScanResult(decodedText));
        });
    }).catch(err => {
        UI.switchView('main-scan');
    });
}

function cancelScanner() {
    Scanner.stop().then(() => UI.switchView(window.lastActiveView || 'main-scan'));
}

/**
 * Scan QR Code from uploaded image
 */
function scanFromImage(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    // Show loading indicator
    UI.showLoading(0);

    // Create a hidden element for the scanner if not exists - MUST BE BEFORE Html5Qrcode instantiation
    if (!document.getElementById('reader-temp')) {
        const tempDiv = document.createElement('div');
        tempDiv.id = 'reader-temp';
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
    }

    // Create a temporary Html5Qrcode instance for file scanning (AFTER element exists)
    const html5QrCode = new Html5Qrcode("reader-temp", { verbose: false });

    html5QrCode.scanFile(file, true)
        .then(decodedText => {
            console.log("QR from Image:", decodedText);

            // Stop camera scanner if running
            Scanner.stop().then(() => {
                // Reset input
                input.value = '';

                // Process the result
                UI.showLoading(2000, () => App.handleScanResult(decodedText));
            });
        })
        .catch(err => {
            console.error("Image scan error:", err);

            // Reset input
            input.value = '';

            // Hide loader and show error
            UI.hideLoading();

            // Show error alert
            alert('Tidak dapat membaca QR Code dari gambar. Pastikan gambar berisi QR Code yang valid.');
        });
}

