'use client';

// ─── Admin Page ─────────────────────────────────────────────────
// Employee management, real-time status view, and session editing.

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { MOCK_EMPLOYEES, getMockEmployeeStatuses } from '@/lib/mock-data';
import { formatTime, breakTypeLabel } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

export default function AdminPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

    const statuses = getMockEmployeeStatuses();

    const filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
        const matchSearch = emp.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRole = filterRole === 'all' || emp.role === filterRole;
        const matchActive =
            filterActive === 'all' ||
            (filterActive === 'active' && emp.is_active) ||
            (filterActive === 'inactive' && !emp.is_active);
        return matchSearch && matchRole && matchActive;
    });

    const roleLabels: Record<UserRole, string> = {
        admin: 'Administrador',
        supervisor: 'Supervisor',
        employee: 'Empleado',
    };

    return (
        <AppShell>
            <div className="admin-page animate-fade-in">
                <h1 className="admin-page__title">Panel de Administración</h1>

                {/* Real-time status overview */}
                <div className="admin-page__status-overview">
                    <h2 className="admin-page__section-title">Estado en tiempo real</h2>
                    <div className="admin-status-grid">
                        {statuses.map((emp) => {
                            const initials = emp.profile.full_name
                                .split(' ').map((n) => n[0]).join('').slice(0, 2);

                            return (
                                <div key={emp.profile.id} className="admin-status-card glass-surface">
                                    <div className="admin-status-card__header">
                                        <div className="admin-status-card__avatar">{initials}</div>
                                        <div className="admin-status-card__info">
                                            <span className="admin-status-card__name">{emp.profile.full_name}</span>
                                            <span className="admin-status-card__role">{roleLabels[emp.profile.role]}</span>
                                        </div>
                                        <span className={`admin-status-badge admin-status-badge--${emp.workdayStatus}`}>
                                            {emp.workdayStatus === 'active' && 'Trabajando'}
                                            {emp.workdayStatus === 'on_break' && 'En pausa'}
                                            {emp.workdayStatus === 'idle' && 'Sin fichar'}
                                        </span>
                                    </div>
                                    {emp.currentSession && (
                                        <div className="admin-status-card__detail">
                                            <span>Entrada: {formatTime(emp.currentSession.check_in)}</span>
                                            {emp.currentBreak && (
                                                <span>Pausa: {breakTypeLabel(emp.currentBreak.break_type)}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Employee management */}
                <div className="admin-page__management">
                    <h2 className="admin-page__section-title">Gestión de empleados</h2>

                    {/* Filters */}
                    <div className="admin-filters glass-surface">
                        <input
                            placeholder="Buscar por nombre..."
                            className="admin-filters__search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="admin-search"
                        />
                        <select
                            className="admin-filters__select"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                            id="admin-filter-role"
                        >
                            <option value="all">Todos los roles</option>
                            <option value="employee">Empleado</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <select
                            className="admin-filters__select"
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                            id="admin-filter-status"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="admin-table-container glass-elevated">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Empleado</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Zona horaria</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp) => {
                                    const initials = emp.full_name
                                        .split(' ').map((n) => n[0]).join('').slice(0, 2);
                                    return (
                                        <tr key={emp.id}>
                                            <td>
                                                <div className="admin-table__user">
                                                    <div className="admin-table__avatar">{initials}</div>
                                                    <span>{emp.full_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`admin-role-badge admin-role-badge--${emp.role}`}>
                                                    {roleLabels[emp.role]}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`admin-active-badge admin-active-badge--${emp.is_active ? 'active' : 'inactive'}`}>
                                                    {emp.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="admin-table__tz">{emp.timezone}</td>
                                            <td>
                                                <button className="admin-table__action-btn">
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .admin-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .admin-page__title {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .admin-page__section-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: var(--space-md);
        }

        .admin-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-md);
        }

        .admin-status-card {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .admin-status-card__header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .admin-status-card__avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--bg-surface-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .admin-status-card__info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .admin-status-card__name {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .admin-status-card__role {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .admin-status-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        .admin-status-badge--active {
          background: var(--status-active-glow);
          color: var(--status-active);
        }

        .admin-status-badge--on_break {
          background: var(--status-break-glow);
          color: var(--status-break);
        }

        .admin-status-badge--idle {
          background: rgba(107, 114, 128, 0.15);
          color: var(--status-idle);
        }

        .admin-status-card__detail {
          display: flex;
          gap: var(--space-md);
          font-size: 0.75rem;
          color: var(--text-muted);
          padding-left: 48px;
        }

        .admin-filters {
          display: flex;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          margin-bottom: var(--space-md);
          flex-wrap: wrap;
        }

        .admin-filters__search {
          flex: 1;
          min-width: 200px;
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.85rem;
        }

        .admin-filters__search:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .admin-filters__search::placeholder {
          color: var(--text-muted);
        }

        .admin-filters__select {
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.85rem;
        }

        .admin-table-container {
          overflow-x: auto;
          padding: 0;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .admin-table th {
          padding: var(--space-md) var(--space-lg);
          text-align: left;
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border-subtle);
        }

        .admin-table td {
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .admin-table tr:hover td {
          background: var(--bg-surface-hover);
        }

        .admin-table__user {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 600;
          color: var(--text-primary);
        }

        .admin-table__avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--bg-surface-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .admin-role-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        .admin-role-badge--admin {
          background: var(--accent-primary-glow);
          color: var(--accent-primary);
        }

        .admin-role-badge--supervisor {
          background: rgba(59, 130, 246, 0.15);
          color: var(--status-completed);
        }

        .admin-role-badge--employee {
          background: rgba(107, 114, 128, 0.15);
          color: var(--text-secondary);
        }

        .admin-active-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        .admin-active-badge--active {
          background: var(--status-active-glow);
          color: var(--status-active);
        }

        .admin-active-badge--inactive {
          background: var(--status-danger-glow);
          color: var(--status-danger);
        }

        .admin-table__tz {
          font-size: 0.8rem;
          color: var(--text-muted) !important;
        }

        .admin-table__action-btn {
          padding: var(--space-xs) var(--space-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .admin-table__action-btn:hover {
          background: var(--accent-primary-glow);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
      `}</style>
        </AppShell>
    );
}
