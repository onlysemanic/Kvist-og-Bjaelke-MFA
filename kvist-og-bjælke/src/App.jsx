import { useEffect, useState } from 'react';
import logoUrl from '../assets/logo.png';
import keycloak, { applicationUrl, initializeKeycloak } from './keycloak';

const userFromToken = () => ({
    username: keycloak.tokenParsed?.preferred_username || keycloak.subject || 'bruger',
    email: keycloak.tokenParsed?.email
});

function App() {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let active = true;

        initializeKeycloak()
            .then((authenticated) => {
                if (!active) return;

                setUser(authenticated ? userFromToken() : null);
                setStatus('ready');
            })
            .catch((error) => {
                console.error('Keycloak initialization failed:', error);

                if (!active) return;

                setMessage('Login kunne ikke startes. Prøv igen.');
                setStatus('error');
            });

        return () => {
            active = false;
        };
    }, []);

    const login = async () => {
        setMessage('');

        try {
            await keycloak.login({ redirectUri: applicationUrl() });
        } catch (error) {
            console.error('Keycloak login failed:', error);
            setMessage('Login kunne ikke startes. Prøv igen.');
        }
    };

    const logout = async () => {
        await keycloak.logout({ redirectUri: applicationUrl() });
    };

    return (
        <main className="page-shell">
            <section className="auth-card">
                <div className="brand-panel">
                    <img
                        className="brand-logo"
                        src={logoUrl}
                        alt="Kvist og Byg ApS"
                    />

                    <div className="brand-copy">
                        <p className="eyebrow">KVIST OG BYG APS</p>
                        <h1>Velkommen hjem</h1>
                        <p>Log ind for at fortsætte.</p>
                    </div>
                </div>

                <div className="form-panel">
                    {user ? (
                        <div className="welcome-state">
                            <span className="success-icon" aria-hidden="true">
                                ✓
                            </span>

                            <p className="eyebrow">Du er logget ind</p>

                            <h2>Hej, {user.username}</h2>

                            {user.email && <p>{user.email}</p>}

                            <button
                                className="secondary-button"
                                type="button"
                                onClick={logout}
                            >
                                Log ud
                            </button>
                        </div>
                    ) : (
                        <div className="form-heading">
                            <p className="eyebrow">VELKOMMEN TILBAGE</p>

                            <h2>Log ind på din konto</h2>

                            <p>
                                Du fortsætter med Keycloak og Microsoft
                                Authenticator.
                            </p>

                            {message && (
                                <p className="message error" role="alert">
                                    {message}
                                </p>
                            )}

                            <button
                                className="primary-button"
                                type="button"
                                onClick={login}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading'
                                    ? 'Vent et øjeblik…'
                                    : 'Log ind'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default App;