/**
 * ssp-mobile-app Global Configuration
 */

const CONFIG = {
    // API Endpoints
    API_URL: 'https://api.sundava.cloud/api/v1/members/scan',

    // Storage Keys
    THEME_STORAGE_KEY: 'ssp_theme_preference',

    // Asset Paths
    ASSETS: {
        LOGO_DARK: 'assets/img/ssp-logo-dark.png',
        LOGO_LIGHT: 'assets/img/ssp-logo-light.png',
        LOADER_DARK: 'assets/img/animated_baru_dark.gif',
        LOADER_LIGHT: 'assets/img/animated_baru_light.gif',
        DEFAULT_SHOP: 'assets/img/default-shop.jpg',
        DEFAULT_AVATAR: 'assets/img/users-profile.jpeg'
    },

    // Scanner Specifics
    SCANNER: {
        FPS: 10,
        QRBOX_SIZE: 250
    }
};
