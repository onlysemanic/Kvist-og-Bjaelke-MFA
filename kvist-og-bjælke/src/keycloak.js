import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8100',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'Kvist-og-Bjaelke',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mfa-app'
});

let initialization;

export const applicationUrl = () => `${window.location.origin}${window.location.pathname}`;

export const initializeKeycloak = () => {
    if (!initialization) {
        initialization = keycloak.init({
            onLoad: 'check-sso',
            pkceMethod: 'S256',
            checkLoginIframe: false,
            redirectUri: applicationUrl()
        });
    }

    return initialization;
};

export default keycloak;
