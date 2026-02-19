'use client';

// ─── Login Page ─────────────────────────────────────────────────
// Authentication form supporting:
//  - Login (email + password)
//  - Register (email + name + password via Supabase signUp)
//  - Forgot password (email via Supabase resetPasswordForEmail)

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase/client';

type Mode = 'login' | 'register' | 'forgot';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    const ok = await login(email, password);
    if (ok) {
      router.replace('/');
    } else {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password || !fullName) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      setSuccess('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.');
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Ingresa tu correo electrónico.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`,
      });
      if (resetError) throw resetError;
      setSuccess('¡Revisa tu correo! Te enviamos un enlace para restablecer tu contraseña.');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Error al enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  const isWorking = isLoading || loading;

  return (
    <div className="login-page">
      <div className="login-card glass-elevated animate-fade-in">
        {/* Logo */}
        <div className="login-card__logo">
          <div className="login-card__logo-icon">
            <Clock size={32} strokeWidth={2.5} />
          </div>
          <h1 className="login-card__brand">ACHL</h1>
          <p className="login-card__subtitle">Control Horario Laboral</p>
        </div>

        {/* Mode tabs */}
        <div className="login-card__mode-tabs">
          <button
            className={`login-card__mode-tab ${mode === 'login' ? 'login-card__mode-tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          >
            Iniciar sesión
          </button>
          <button
            className={`login-card__mode-tab ${mode === 'register' ? 'login-card__mode-tab--active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
          >
            Registrarse
          </button>
        </div>

        {/* Login form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="login-card__form">
            {error && <div className="login-card__alert login-card__alert--error">{error}</div>}

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
              <button
                type="button"
                className="login-card__forgot"
                onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="login-card__submit"
              disabled={isWorking}
              id="btn-login"
            >
              {isWorking ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        )}

        {/* Register form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="login-card__form">
            {error && <div className="login-card__alert login-card__alert--error">{error}</div>}
            {success && <div className="login-card__alert login-card__alert--success">{success}</div>}

            <div className="login-card__field">
              <label htmlFor="reg-name" className="login-card__label">Nombre completo</label>
              <input
                id="reg-name"
                type="text"
                className="login-card__input"
                placeholder="Juan García"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="login-card__field">
              <label htmlFor="reg-email" className="login-card__label">Correo electrónico</label>
              <input
                id="reg-email"
                type="email"
                className="login-card__input"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="login-card__field">
              <label htmlFor="reg-password" className="login-card__label">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                className="login-card__input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="login-card__submit"
              disabled={isWorking}
              id="btn-register"
            >
              {isWorking ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}

        {/* Forgot password form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="login-card__form">
            {error && <div className="login-card__alert login-card__alert--error">{error}</div>}
            {success && <div className="login-card__alert login-card__alert--success">{success}</div>}

            <p className="login-card__hint">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <div className="login-card__field">
              <label htmlFor="forgot-email" className="login-card__label">Correo electrónico</label>
              <input
                id="forgot-email"
                type="email"
                className="login-card__input"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="login-card__submit"
              disabled={isWorking}
              id="btn-forgot"
            >
              {isWorking ? 'Enviando...' : 'Enviar enlace'}
            </button>

            <button
              type="button"
              className="login-card__back"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            >
              ← Volver a iniciar sesión
            </button>
          </form>
        )}
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
          margin-bottom: var(--space-xl);
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

        .login-card__mode-tabs {
          display: flex;
          gap: 2px;
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 3px;
          margin-bottom: var(--space-lg);
        }

        .login-card__mode-tab {
          flex: 1;
          padding: var(--space-sm) var(--space-md);
          border: none;
          background: none;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .login-card__mode-tab--active {
          background: var(--accent-primary);
          color: white;
        }

        .login-card__form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .login-card__alert {
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .login-card__alert--error {
          background: var(--status-danger-glow);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--status-danger);
        }

        .login-card__alert--success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .login-card__hint {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
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
          background: none;
          border: none;
          padding: 0;
          color: var(--accent-secondary);
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
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
          min-height: 44px;
        }

        .login-card__submit:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow: var(--shadow-glow-purple);
        }

        .login-card__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-card__back {
          background: none;
          border: none;
          padding: var(--space-xs) 0;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.85rem;
          cursor: pointer;
          text-align: center;
          transition: color var(--transition-fast);
        }

        .login-card__back:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
