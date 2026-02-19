'use client';

// ─── Profile Page ───────────────────────────────────────────────
// Profile editing: name, timezone, password change.

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/stores/authStore';

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
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saved, setSaved] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSaved, setPasswordSaved] = useState(false);

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
        setTimeout(() => setSaved(false), 2000);
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSaved(false);

        if (!currentPassword) {
            setPasswordError('Ingresa tu contraseña actual.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden.');
            return;
        }

        // Mock: no real password change
        setPasswordSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSaved(false), 2000);
    };

    return (
        <AppShell>
            <div className="profile-page animate-fade-in">
                <h1 className="profile-page__title">Mi Perfil</h1>

                <div className="profile-page__grid">
                    {/* Profile Info */}
                    <div className="profile-section glass-elevated">
                        <div className="profile-section__avatar-area">
                            <div className="profile-section__avatar">{initials}</div>
                            <div className="profile-section__avatar-info">
                                <span className="profile-section__name">{user?.full_name}</span>
                                <span className="profile-section__role">
                                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'supervisor' ? 'Supervisor' : 'Empleado'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="profile-form">
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

                            <button type="submit" className="profile-form__submit" id="btn-save-profile">
                                {saved ? '✓ Guardado' : 'Guardar cambios'}
                            </button>
                        </form>
                    </div>

                    {/* Password Change */}
                    <div className="profile-section glass-elevated">
                        <h2 className="profile-section__title">Cambiar contraseña</h2>

                        {passwordError && (
                            <div className="profile-form__error">{passwordError}</div>
                        )}
                        {passwordSaved && (
                            <div className="profile-form__success">Contraseña actualizada correctamente.</div>
                        )}

                        <form onSubmit={handleChangePassword} className="profile-form">
                            <div className="profile-form__field">
                                <label htmlFor="current-password">Contraseña actual</label>
                                <input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="profile-form__input"
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="profile-form__field">
                                <label htmlFor="new-password">Nueva contraseña</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="profile-form__input"
                                    autoComplete="new-password"
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

                            <button type="submit" className="profile-form__submit profile-form__submit--secondary" id="btn-change-password">
                                Cambiar contraseña
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
        }

        .profile-page__title {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .profile-page__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: var(--space-xl);
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
        }

        .profile-section__avatar-info {
          display: flex;
          flex-direction: column;
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
        }

        .profile-form__input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-primary-glow);
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
          margin-top: var(--space-sm);
        }

        .profile-form__submit:hover {
          filter: brightness(1.1);
        }

        .profile-form__submit--secondary {
          background: var(--bg-surface);
          color: var(--text-primary);
          border: 1px solid var(--border-default);
        }

        .profile-form__submit--secondary:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .profile-form__error {
          padding: var(--space-sm);
          background: var(--status-danger-glow);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--status-danger);
          font-size: 0.85rem;
        }

        .profile-form__success {
          padding: var(--space-sm);
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
