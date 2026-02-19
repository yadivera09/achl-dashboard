'use client';

// ─── Login Page ─────────────────────────────────────────────────
// Authentication form with email/password, styled with dark theme.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.push('/');
        } else {
            setError('Credenciales inválidas. Intenta de nuevo.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass-elevated animate-fade-in">
                {/* Logo */}
                <div className="login-card__logo">
                    <div className="login-card__logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <h1 className="login-card__brand">ACHL</h1>
                    <p className="login-card__subtitle">Control Horario Laboral</p>
                </div>

                <form onSubmit={handleSubmit} className="login-card__form">
                    {error && (
                        <div className="login-card__error">{error}</div>
                    )}

                    <div className="login-card__field">
                        <label htmlFor="login-email" className="login-card__label">Correo electrónico</label>
                        <input
                            id="login-email"
                            type="email"
                            className="login-card__input"
                            placeholder="tu@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-card__field">
                        <label htmlFor="login-password" className="login-card__label">Contraseña</label>
                        <input
                            id="login-password"
                            type="password"
                            className="login-card__input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="login-card__options">
                        <label className="login-card__remember">
                            <input type="checkbox" />
                            <span>Recordarme</span>
                        </label>
                        <a href="/forgot-password" className="login-card__forgot">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button
                        type="submit"
                        className="login-card__submit"
                        disabled={isLoading}
                        id="btn-login"
                    >
                        {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>

                    <p className="login-card__register">
                        ¿No tienes cuenta?{' '}
                        <a href="/register" className="login-card__register-link">Regístrate</a>
                    </p>
                </form>
            </div>

            <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          background:
            radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
            var(--bg-primary);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: var(--space-2xl);
        }

        .login-card__logo {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .login-card__logo-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-glow-purple);
          margin-bottom: var(--space-md);
        }

        .login-card__brand {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }

        .login-card__subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .login-card__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .login-card__error {
          padding: var(--space-sm) var(--space-md);
          background: var(--status-danger-glow);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--status-danger);
          font-size: 0.85rem;
        }

        .login-card__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .login-card__label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .login-card__input {
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
        }

        .login-card__input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-primary-glow);
        }

        .login-card__input::placeholder {
          color: var(--text-muted);
        }

        .login-card__options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .login-card__remember {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--text-muted);
          cursor: pointer;
        }

        .login-card__remember input {
          accent-color: var(--accent-primary);
        }

        .login-card__forgot {
          color: var(--accent-secondary);
          text-decoration: none;
          font-weight: 500;
        }

        .login-card__forgot:hover {
          text-decoration: underline;
        }

        .login-card__submit {
          padding: var(--space-sm) var(--space-md);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover));
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-top: var(--space-sm);
        }

        .login-card__submit:hover {
          filter: brightness(1.1);
          box-shadow: var(--shadow-glow-purple);
        }

        .login-card__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-card__register {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .login-card__register-link {
          color: var(--accent-secondary);
          text-decoration: none;
          font-weight: 500;
        }

        .login-card__register-link:hover {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
}
