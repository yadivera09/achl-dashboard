'use client';

// ─── Profile Page ───────────────────────────────────────────────
// Profile editing: name, timezone, email display, real password change via Supabase.

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase/client';

const TIMEZONES = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Buenos_Aires',
  'America/Santiago',
  'America/Lima',
  'America/Sao_Paulo',
  'Europe/Madrid',
  'UTC',
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [timezone, setTimezone] = useState(user?.timezone ?? 'UTC');
  const [saved, setSaved] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ full_name: fullName, timezone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordSaved(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const roleLabel =
    user?.role === 'admin' ? 'Administrador'
      : user?.role === 'supervisor' ? 'Supervisor'
        : 'Empleado';

  return (
    <AppShell>
      <div className="profile-page animate-fade-in">
        <h1 className="profile-page__title">Mi Perfil</h1>

        <div className="profile-page__grid">
          {/* ── Profile Info ───────────────── */}
          <div className="profile-section glass-elevated">
            <div className="profile-section__avatar-area">
              <div className="profile-section__avatar">{initials}</div>
              <div className="profile-section__avatar-info">
                <span className="profile-section__name">{user?.full_name}</span>
                <span className="profile-section__role">{roleLabel}</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              {/* Email — read-only */}
              <div className="profile-form__field">
                <label htmlFor="profile-email">Correo electrónico</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="profile-form__input profile-form__input--readonly"
                  title="El correo no se puede cambiar desde aquí"
                />
              </div>

              <div className="profile-form__field">
                <label htmlFor="profile-name">Nombre completo</label>
                <input
                  id="profile-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="profile-form__input"
                />
              </div>

              <div className="profile-form__field">
                <label htmlFor="profile-tz">Zona horaria</label>
                <select
                  id="profile-tz"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="profile-form__input"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              {saved && (
                <div className="profile-form__success">✓ Cambios guardados correctamente.</div>
              )}

              <button type="submit" className="profile-form__submit" id="btn-save-profile">
                Guardar cambios
              </button>
            </form>
          </div>

          {/* ── Password Change ─────────────── */}
          <div className="profile-section glass-elevated">
            <h2 className="profile-section__title">Cambiar contraseña</h2>
            <p className="profile-section__hint">
              Tu sesión activa es suficiente para cambiar la contraseña. No se requiere la contraseña actual.
            </p>

            {passwordError && (
              <div className="profile-form__error">{passwordError}</div>
            )}
            {passwordSaved && (
              <div className="profile-form__success">✓ Contraseña actualizada correctamente.</div>
            )}

            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="profile-form__field">
                <label htmlFor="new-password">Nueva contraseña</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="profile-form__input"
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="profile-form__field">
                <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="profile-form__input"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="profile-form__submit profile-form__submit--secondary"
                id="btn-change-password"
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Actualizando…' : 'Cambiar contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          max-width: 960px;
        }

        .profile-page__title {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .profile-page__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: var(--space-xl);
          align-items: start;
        }

        .profile-section {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .profile-section__title {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .profile-section__hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-top: calc(var(--space-xs) * -1);
        }

        .profile-section__avatar-area {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .profile-section__avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
          box-shadow: var(--shadow-glow-purple);
          flex-shrink: 0;
        }

        .profile-section__avatar-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .profile-section__name {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .profile-section__role {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .profile-form__field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .profile-form__field label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .profile-form__input {
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .profile-form__input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-primary-glow);
        }

        .profile-form__input--readonly {
          color: var(--text-muted);
          cursor: default;
          background: var(--bg-secondary);
        }

        .profile-form__submit {
          padding: var(--space-sm) var(--space-md);
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-top: var(--space-xs);
        }

        .profile-form__submit:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        .profile-form__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .profile-form__submit--secondary {
          background: var(--bg-surface);
          color: var(--text-primary);
          border: 1px solid var(--border-default);
        }

        .profile-form__submit--secondary:hover:not(:disabled) {
          filter: none;
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .profile-form__error {
          padding: var(--space-sm) var(--space-md);
          background: var(--status-danger-glow);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--status-danger);
          font-size: 0.85rem;
        }

        .profile-form__success {
          padding: var(--space-sm) var(--space-md);
          background: var(--status-active-glow);
          border: 1px solid rgba(39, 174, 96, 0.3);
          border-radius: var(--radius-md);
          color: var(--status-active);
          font-size: 0.85rem;
        }
      `}</style>
    </AppShell>
  );
}

