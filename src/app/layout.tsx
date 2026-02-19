import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'ACHL — Control Horario Laboral',
    description:
        'Aplicación de Control Horario Laboral — Registra entradas, salidas y pausas de tu jornada laboral.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
