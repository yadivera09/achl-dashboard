**ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE**

Aplicación de Control Horario Laboral

─────────────────────────────────────

| Documento | SRS-CHT-001 |
| :---- | :---- |
| **Versión** | 1.0 |
| **Fecha** | Febrero 2026 |
| **Estado** | Borrador |
| **Clasificación** | Confidencial |
| **Tecnología BD** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth |

# **1\. Introducción**

## **1.1 Propósito**

Este documento describe los requerimientos funcionales y no funcionales de la Aplicación de Control Horario Laboral (ACHL). Su objetivo es servir como guía completa para el equipo de desarrollo, QA, y stakeholders durante todo el ciclo de vida del proyecto. El sistema permitirá a organizaciones gestionar de manera eficiente el registro de jornadas laborales de sus empleados.

## **1.2 Alcance**

La ACHL es una aplicación web moderna que permite a los usuarios registrar entradas y salidas, gestionar pausas durante la jornada laboral, y visualizar reportes detallados del tiempo trabajado. El sistema utilizará Supabase como plataforma de base de datos y autenticación, garantizando escalabilidad, seguridad y disponibilidad.

Funcionalidades incluidas en el alcance:

* Registro de entrada y salida laboral con marca de tiempo

* Gestión de pausas y descansos durante la jornada

* Cálculo automático de horas trabajadas y descansos acumulados

* Generación de reportes visuales e histórico de jornadas

* Autenticación y gestión de usuarios mediante Supabase Auth

* Panel de administración para gestión de empleados y turnos

* Interfaz web responsive compatible con dispositivos móviles y escritorio

## **1.3 Definiciones, Acrónimos y Abreviaturas**

| Término | Definición |
| :---- | :---- |
| **ACHL** | Aplicación de Control Horario Laboral — sistema objeto de este documento |
| **SRS** | Software Requirements Specification — Especificación de Requerimientos de Software |
| **Supabase** | Plataforma open-source BaaS (Backend as a Service) basada en PostgreSQL |
| **RLS** | Row Level Security — política de seguridad a nivel de fila en PostgreSQL/Supabase |
| **JWT** | JSON Web Token — estándar abierto para transmisión segura de información entre partes |
| **UI/UX** | User Interface / User Experience — Interfaz y Experiencia de Usuario |
| **RF** | Requerimiento Funcional |
| **RNF** | Requerimiento No Funcional |
| **Jornada** | Período de trabajo comprendido entre la entrada y la salida laboral de un empleado |
| **Pausa** | Interrupción temporal de la jornada laboral (descanso, almuerzo, etc.) |
| **Check-in** | Registro de entrada al inicio de la jornada laboral |
| **Check-out** | Registro de salida al finalizar la jornada laboral |

## **1.4 Referencias**

* IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications

* Documentación oficial de Supabase: https://supabase.com/docs

* WCAG 2.1 — Web Content Accessibility Guidelines

* OWASP Top 10 — Guía de seguridad para aplicaciones web

## **1.5 Visión General del Documento**

El presente documento se organiza en las siguientes secciones: Sección 2 describe el contexto general del sistema; Sección 3 detalla los requerimientos funcionales; Sección 4 especifica los requerimientos no funcionales; Sección 5 describe el modelo de datos; Sección 6 aborda los requisitos de la interfaz; y Sección 7 presenta las restricciones y criterios de aceptación.

# **2\. Descripción General del Sistema**

## **2.1 Perspectiva del Producto**

La ACHL es una aplicación web independiente que funciona como sistema autónomo de control horario. Se integra con Supabase para la persistencia de datos y la gestión de identidades, eliminando la necesidad de infraestructura de servidor personalizada para estas funciones críticas. La aplicación es accesible desde cualquier dispositivo con navegador web moderno, sin requerir instalación de software adicional por parte del usuario.

## **2.2 Funciones Principales del Producto**

* Registro de Check-in/Check-out: los usuarios pueden registrar su entrada y salida con un solo clic, quedando almacenada la marca de tiempo exacta.

* Gestión de Pausas: inicio y fin de pausas durante la jornada, con categorización (descanso, almuerzo, médico, etc.).

* Cálculo Automático: el sistema calcula en tiempo real las horas trabajadas netas, descontando automáticamente las pausas registradas.

* Dashboard en Tiempo Real: visualización del estado actual de la jornada, tiempo transcurrido y pausas acumuladas.

* Histórico de Jornadas: acceso al historial completo de jornadas con filtros por fecha, semana o mes.

* Reportes Visuales: gráficos de horas trabajadas por día, semana y mes con exportación de datos.

* Gestión de Perfil: actualización de datos personales e información laboral del usuario.

* Panel de Administración: gestión de empleados, aprobación de registros y generación de reportes agregados.

## **2.3 Características de los Usuarios**

| Tipo de Usuario | Descripción | Nivel Técnico | Permisos |
| :---- | :---- | :---- | :---- |
| Empleado | Usuario final que registra su jornada diaria | Básico | CRUD propio |
| Supervisor | Gestiona el equipo y revisa registros | Medio | Lectura equipo |
| Administrador | Gestiona toda la plataforma y usuarios | Avanzado | Acceso total |

## **2.4 Restricciones Generales**

* La aplicación requiere conexión a internet para operar, ya que depende de Supabase como backend.

* El navegador del usuario debe ser compatible con ES2020+ y CSS Grid/Flexbox.

* La retención de datos de jornadas estará sujeta a la política de privacidad vigente.

* Las contraseñas de usuarios son gestionadas exclusivamente por Supabase Auth; el sistema no almacena credenciales en texto plano.

## **2.5 Suposiciones y Dependencias**

* Se asume disponibilidad del servicio Supabase con SLA adecuado para producción.

* Los usuarios tienen acceso a dispositivos con navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

* La organización define políticas de jornada laboral que serán configuradas por el administrador.

* Se dispone de conectividad de red estable en los puntos de acceso de los empleados.

# **3\. Requerimientos Funcionales**

## **3.1 Módulo de Autenticación y Sesión**

Gestión completa del ciclo de vida de la sesión del usuario utilizando Supabase Auth.

| ID | Descripción | Prioridad | Módulo |
| :---- | :---- | :---- | :---- |
| RF-01 | El sistema debe permitir el registro de nuevos usuarios mediante correo electrónico y contraseña a través de Supabase Auth. | **Alta** | Autenticación |
| RF-02 | El sistema debe permitir el inicio de sesión con correo y contraseña, generando un JWT válido mediante Supabase Auth. | **Alta** | Autenticación |
| RF-03 | El sistema debe ofrecer la opción de inicio de sesión mediante proveedores OAuth (Google, GitHub) integrados con Supabase Auth. | **Media** | Autenticación |
| RF-04 | El sistema debe enviar un correo de verificación al registrar una nueva cuenta antes de permitir el acceso. | **Alta** | Autenticación |
| RF-05 | El sistema debe permitir la recuperación de contraseña mediante enlace enviado al correo electrónico registrado. | **Alta** | Autenticación |
| RF-06 | El sistema debe cerrar la sesión del usuario de forma segura, invalidando el token JWT en Supabase. | **Alta** | Autenticación |
| RF-07 | El sistema debe renovar automáticamente el token de sesión antes de su expiración para mantener la sesión activa. | **Alta** | Autenticación |
| RF-08 | El sistema debe redirigir al usuario a la pantalla de login si intenta acceder a rutas protegidas sin sesión activa. | **Alta** | Autenticación |

## **3.2 Módulo de Registro de Jornada**

Funcionalidades centrales para el registro de entradas, salidas y pausas laborales.

| ID | Descripción | Prioridad | Módulo |
| :---- | :---- | :---- | :---- |
| RF-09 | El sistema debe mostrar un botón prominente de Check-in al usuario que no tenga jornada activa, registrando la marca de tiempo exacta al presionarlo. | **Alta** | Jornada |
| RF-10 | El sistema debe mostrar un botón de Check-out al usuario con jornada activa y sin pausa en curso, registrando la hora de salida. | **Alta** | Jornada |
| RF-11 | El sistema debe impedir que un usuario realice Check-in si ya tiene una jornada activa sin Check-out registrado. | **Alta** | Jornada |
| RF-12 | El sistema debe permitir al usuario iniciar una pausa durante una jornada activa, seleccionando el tipo de pausa (descanso, almuerzo, médico, otro). | **Alta** | Pausas |
| RF-13 | El sistema debe permitir finalizar una pausa activa, registrando la duración total de la misma. | **Alta** | Pausas |
| RF-14 | El sistema debe calcular y mostrar en tiempo real el contador de horas trabajadas netas (excluyendo pausas). | **Alta** | Jornada |
| RF-15 | El sistema debe calcular y mostrar el total de tiempo en pausa acumulado durante la jornada activa. | **Alta** | Pausas |
| RF-16 | El sistema debe permitir agregar notas opcionales al realizar Check-in, Check-out o al registrar una pausa. | **Baja** | Jornada |
| RF-17 | El sistema debe permitir al administrador editar o corregir registros de jornada dentro de los últimos 30 días. | **Media** | Jornada |
| RF-18 | El sistema debe registrar toda modificación manual de jornada con usuario, fecha y motivo (log de auditoría). | **Alta** | Auditoría |

## **3.3 Módulo de Dashboard**

Visualización del estado actual y resumen de la jornada para el usuario autenticado.

| ID | Descripción | Prioridad | Módulo |
| :---- | :---- | :---- | :---- |
| RF-19 | El dashboard debe mostrar el estado actual de la jornada del usuario: sin iniciar, activa, en pausa, o finalizada. | **Alta** | Dashboard |
| RF-20 | El dashboard debe mostrar el tiempo transcurrido desde el Check-in en formato HH:MM:SS actualizándose cada segundo. | **Alta** | Dashboard |
| RF-21 | El dashboard debe mostrar el resumen del día actual: hora de entrada, pausas tomadas, tiempo neto trabajado. | **Alta** | Dashboard |
| RF-22 | El dashboard debe mostrar un resumen semanal con el total de horas trabajadas por día en la semana actual. | **Media** | Dashboard |
| RF-23 | El dashboard debe mostrar una alerta visual cuando el usuario supere las horas laborales máximas configuradas. | **Media** | Dashboard |
| RF-24 | El dashboard debe mostrar el historial de las últimas 5 jornadas del usuario con su duración. | **Media** | Dashboard |

## **3.4 Módulo de Histórico y Reportes**

Acceso al historial de jornadas y generación de reportes visuales del tiempo trabajado.

| ID | Descripción | Prioridad | Módulo |
| :---- | :---- | :---- | :---- |
| RF-25 | El sistema debe mostrar el historial completo de jornadas del usuario con filtros por rango de fechas. | **Alta** | Reportes |
| RF-26 | El sistema debe mostrar gráficos de barras con las horas trabajadas por día en la semana o mes seleccionado. | **Alta** | Reportes |
| RF-27 | El sistema debe calcular y mostrar estadísticas del período: total horas, promedio diario, días trabajados. | **Alta** | Reportes |
| RF-28 | El sistema debe permitir exportar el reporte de jornadas en formato CSV. | **Media** | Reportes |
| RF-29 | El sistema debe mostrar una comparativa entre horas planificadas y horas reales trabajadas por semana. | **Media** | Reportes |
| RF-30 | El administrador debe poder generar reportes agregados de todo el equipo con filtros por empleado y período. | **Alta** | Reportes |
| RF-31 | El sistema debe generar un reporte mensual en formato PDF exportable con resumen de jornadas. | **Baja** | Reportes |

## **3.5 Módulo de Administración**

Funcionalidades exclusivas para usuarios con rol de Administrador.

| ID | Descripción | Prioridad | Módulo |
| :---- | :---- | :---- | :---- |
| RF-32 | El administrador debe poder invitar nuevos usuarios al sistema mediante correo electrónico. | **Alta** | Admin |
| RF-33 | El administrador debe poder asignar y modificar roles (Empleado, Supervisor, Administrador) a los usuarios. | **Alta** | Admin |
| RF-34 | El administrador debe poder activar o desactivar cuentas de usuario sin eliminar su historial. | **Alta** | Admin |
| RF-35 | El administrador debe poder configurar la jornada laboral estándar (horas diarias, días laborales). | **Media** | Admin |
| RF-36 | El administrador debe poder visualizar en tiempo real el estado de todos los empleados (con jornada activa, en pausa, sin fichar). | **Alta** | Admin |
| RF-37 | El sistema debe enviar notificaciones al administrador cuando un empleado supere las horas máximas diarias. | **Baja** | Admin |

## **3.6 Módulo de Perfil de Usuario**

| ID | Descripción | Prioridad | Módulo |
| :---- | :---- | :---- | :---- |
| RF-38 | El usuario debe poder actualizar su nombre, apellido y foto de perfil. | **Media** | Perfil |
| RF-39 | El usuario debe poder cambiar su contraseña, requiriendo confirmación de la contraseña actual. | **Alta** | Perfil |
| RF-40 | El usuario debe poder configurar su zona horaria para el correcto registro de marcas de tiempo. | **Media** | Perfil |
| RF-41 | El usuario debe poder elegir el idioma de la interfaz (español e inglés en la versión inicial). | **Baja** | Perfil |

# **4\. Requerimientos No Funcionales**

## **4.1 Rendimiento**

* RNF-01: El tiempo de carga inicial de la aplicación no debe superar los 3 segundos en conexiones de 10 Mbps.

* RNF-02: Las operaciones de Check-in/Check-out deben completarse y reflejarse en la UI en menos de 1 segundo.

* RNF-03: Los reportes con hasta 365 días de datos deben generarse en menos de 5 segundos.

* RNF-04: El sistema debe soportar hasta 500 usuarios concurrentes sin degradación de rendimiento.

* RNF-05: Los contadores en tiempo real (cronómetro de jornada) deben actualizarse con precisión de ±1 segundo.

## **4.2 Seguridad**

* RNF-06: Toda comunicación entre el cliente y Supabase debe realizarse mediante HTTPS/TLS 1.3.

* RNF-07: Se deben implementar políticas de Row Level Security (RLS) en Supabase para garantizar que cada usuario solo acceda a sus propios datos.

* RNF-08: Los tokens JWT deben tener una duración máxima de 1 hora, con renovación automática via refresh token.

* RNF-09: El sistema debe implementar rate limiting en los endpoints de autenticación para prevenir ataques de fuerza bruta.

* RNF-10: Los datos sensibles de los usuarios deben estar cifrados en reposo dentro de la base de datos Supabase.

* RNF-11: El sistema debe registrar intentos de acceso fallidos y bloquear temporalmente IPs con más de 5 intentos consecutivos.

## **4.3 Usabilidad**

* RNF-12: La interfaz debe seguir principios de diseño Material Design 3 o similares para garantizar consistencia visual.

* RNF-13: Las operaciones principales (Check-in/out, pausas) deben ser accesibles en máximo 2 clics desde cualquier pantalla.

* RNF-14: La aplicación debe ser totalmente responsive, ofreciendo una experiencia óptima en pantallas de 320px hasta 2560px de ancho.

* RNF-15: La aplicación debe cumplir con los criterios de accesibilidad WCAG 2.1 nivel AA.

* RNF-16: El sistema debe mostrar mensajes de error claros y accionables en español cuando una operación falle.

* RNF-17: La aplicación debe funcionar en modo sin errores en los navegadores Chrome, Firefox, Safari y Edge en sus versiones de los últimos 2 años.

## **4.4 Confiabilidad y Disponibilidad**

* RNF-18: El sistema debe alcanzar una disponibilidad del 99.5% mensual, en consonancia con el SLA de Supabase Pro.

* RNF-19: El sistema debe implementar manejo de errores graceful; si Supabase no está disponible, debe mostrar un mensaje informativo al usuario.

* RNF-20: Los datos de jornada deben ser persistidos de forma atómica; no puede quedar un Check-in sin su Check-out en estado inconsistente por error del sistema.

## **4.5 Mantenibilidad y Escalabilidad**

* RNF-21: El código fuente debe seguir principios SOLID y estar organizado en módulos/componentes independientes.

* RNF-22: La cobertura de pruebas unitarias debe ser mínimo del 70% para los módulos de cálculo de jornada.

* RNF-23: La arquitectura debe permitir escalar horizontalmente sin cambios en el backend (Supabase gestiona esto nativamente).

* RNF-24: El sistema debe disponer de documentación técnica de la API y del esquema de base de datos actualizada.

# **5\. Modelo de Datos (Supabase/PostgreSQL)**

## **5.1 Tablas Principales**

### **5.1.1 Tabla: profiles**

Extiende la tabla auth.users de Supabase con información adicional del usuario.

| Campo | Tipo | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK, FK auth.users | Identificador único del usuario |
| **full\_name** | TEXT | NOT NULL | Nombre completo del usuario |
| **avatar\_url** | TEXT | NULLABLE | URL de foto de perfil |
| **role** | TEXT | DEFAULT 'employee' | Rol: employee, supervisor, admin |
| **timezone** | TEXT | DEFAULT 'UTC' | Zona horaria del usuario |
| **is\_active** | BOOLEAN | DEFAULT true | Estado activo/inactivo de la cuenta |
| **created\_at** | TIMESTAMPTZ | DEFAULT now() | Fecha de creación del perfil |
| **updated\_at** | TIMESTAMPTZ | DEFAULT now() | Fecha de última actualización |

### **5.1.2 Tabla: work\_sessions**

Almacena cada jornada laboral registrada por los usuarios.

| Campo | Tipo | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK, DEFAULT gen\_random\_uuid() | Identificador único de la jornada |
| **user\_id** | UUID | FK profiles(id), NOT NULL | Usuario al que pertenece la jornada |
| **check\_in** | TIMESTAMPTZ | NOT NULL | Marca de tiempo de entrada |
| **check\_out** | TIMESTAMPTZ | NULLABLE | Marca de tiempo de salida |
| **net\_minutes** | INTEGER | NULLABLE | Minutos trabajados netos calculados |
| **pause\_minutes** | INTEGER | DEFAULT 0 | Total de minutos en pausa |
| **notes** | TEXT | NULLABLE | Notas opcionales de la jornada |
| **status** | TEXT | DEFAULT 'active' | Estado: active, completed, edited |
| **created\_at** | TIMESTAMPTZ | DEFAULT now() | Fecha de creación del registro |

### **5.1.3 Tabla: breaks**

Almacena cada pausa registrada dentro de una jornada laboral.

| Campo | Tipo | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK, DEFAULT gen\_random\_uuid() | Identificador único de la pausa |
| **session\_id** | UUID | FK work\_sessions(id) | Jornada a la que pertenece |
| **user\_id** | UUID | FK profiles(id) | Usuario al que pertenece |
| **break\_type** | TEXT | NOT NULL | Tipo: rest, lunch, medical, other |
| **started\_at** | TIMESTAMPTZ | NOT NULL | Inicio de la pausa |
| **ended\_at** | TIMESTAMPTZ | NULLABLE | Fin de la pausa |
| **duration\_minutes** | INTEGER | NULLABLE | Duración en minutos (calculado) |
| **notes** | TEXT | NULLABLE | Notas opcionales de la pausa |

### **5.1.4 Tabla: audit\_logs**

Registro de auditoría de todas las modificaciones manuales realizadas por administradores.

| Campo | Tipo | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| **id** | UUID | PK | Identificador del log |
| **editor\_id** | UUID | FK profiles(id) | Usuario que realizó la edición |
| **target\_id** | UUID | NOT NULL | ID del registro modificado |
| **table\_name** | TEXT | NOT NULL | Tabla afectada |
| **action** | TEXT | NOT NULL | Acción: update, delete, insert |
| **old\_data** | JSONB | NULLABLE | Datos anteriores al cambio |
| **new\_data** | JSONB | NULLABLE | Datos posteriores al cambio |
| **reason** | TEXT | NOT NULL | Motivo de la modificación |
| **created\_at** | TIMESTAMPTZ | DEFAULT now() | Fecha del cambio |

## **5.2 Políticas de Seguridad RLS**

Todas las tablas deben tener Row Level Security habilitado en Supabase con las siguientes políticas básicas:

* profiles: Los usuarios pueden leer y actualizar únicamente su propio perfil. Los administradores pueden leer todos los perfiles.

* work\_sessions: Los usuarios pueden crear, leer y actualizar únicamente sus propias jornadas. Los supervisores y administradores pueden leer las jornadas de su equipo.

* breaks: Los usuarios solo acceden a las pausas asociadas a sus propias jornadas.

* audit\_logs: Solo los administradores tienen acceso de lectura. El sistema inserta mediante service role key.

# **6\. Requisitos de Interfaz de Usuario**

## **6.1 Pantallas Principales**

### **6.1.1 Pantalla de Autenticación**

* Formulario de login con campos de email y contraseña con validación en tiempo real.

* Enlace a registro de nueva cuenta y a recuperación de contraseña.

* Botones de autenticación OAuth (Google, GitHub) con íconos reconocibles.

* Diseño centrado, con branding de la aplicación y fondo atractivo.

### **6.1.2 Dashboard Principal**

* Tarjeta central de estado de jornada con botón de acción grande y visible (Check-in / Check-out / Pausa).

* Cronómetro en tiempo real con horas trabajadas netas en formato HH:MM:SS.

* Panel lateral o inferior con resumen del día: entrada, salidas, pausas acumuladas.

* Gráfico de barras con horas trabajadas en la semana actual.

* Lista de las últimas jornadas con acceso rápido al detalle.

### **6.1.3 Historial de Jornadas**

* Tabla paginada con todas las jornadas ordenadas por fecha descendente.

* Filtros por rango de fechas con selector de calendario.

* Columnas: Fecha, Entrada, Salida, Pausas, Horas Netas, Estado.

* Botón de exportación CSV visible en la parte superior de la tabla.

* Acceso al detalle de cada jornada con el listado de pausas.

### **6.1.4 Reportes**

* Selector de período: semana actual, mes actual, mes anterior, rango personalizado.

* Gráfico de barras con horas por día del período seleccionado.

* Tarjetas de resumen: total horas, promedio diario, días trabajados, días con pausa.

* Tabla detallada de jornadas del período con totales.

### **6.1.5 Panel de Administración**

* Vista de mapa de calor o tabla de estado en tiempo real de todos los empleados.

* Listado de usuarios con búsqueda, filtros por rol y estado.

* Formulario de edición de jornadas con campo de motivo obligatorio.

* Reportes exportables por empleado o de todo el equipo.

## **6.2 Componentes de Diseño**

* Sistema de diseño basado en tokens de color con soporte para modo claro y oscuro.

* Paleta de colores primaria azul corporativo (\#1E3A5F) con acento en verde (\#27AE60) para estados activos.

* Tipografía Inter o similar sans-serif de alta legibilidad como fuente principal.

* Iconografía consistente mediante Lucide Icons o Heroicons.

* Animaciones sutiles de transición de estado (máximo 300ms) para no interferir con la productividad.

* Componentes de toast/notificación para confirmaciones y errores de operaciones críticas.

## **6.3 Requisitos Responsive**

* Breakpoint móvil (\<768px): navegación inferior, tarjeta de acción a pantalla completa.

* Breakpoint tablet (768px-1024px): sidebar colapsable, gráficos adaptados.

* Breakpoint escritorio (\>1024px): layout de dos columnas con sidebar fijo.

# **7\. Restricciones Técnicas y Criterios de Aceptación**

## **7.1 Stack Tecnológico Recomendado**

| Capa | Tecnología | Justificación |
| :---- | :---- | :---- |
| **Frontend Framework** | React 18+ / Next.js 14+ | Ecosistema maduro, SSR opcional, App Router |
| **Estilos** | Tailwind CSS \+ shadcn/ui | Productividad, consistencia, accesibilidad |
| **Estado Global** | Zustand o Jotai | Ligero, sin boilerplate, integración con Supabase |
| **Base de Datos** | Supabase (PostgreSQL) | BaaS escalable, RLS nativo, realtime |
| **Autenticación** | Supabase Auth | JWT, OAuth, MFA, integrado con BD |
| **Gráficos** | Recharts o Chart.js | Compatibilidad React, responsive, personalizable |
| **Tiempo Real** | Supabase Realtime | WebSockets gestionados, sin infraestructura extra |
| **Testing** | Vitest \+ React Testing Library | Rápido, compatible con Vite/Next.js |

## **7.2 Criterios de Aceptación por Módulo**

### **7.2.1 Autenticación**

1. El usuario puede registrarse con correo/contraseña y recibe email de verificación en menos de 2 minutos.

2. El usuario puede iniciar sesión con credenciales válidas y es redirigido al dashboard en menos de 2 segundos.

3. Un usuario con token expirado es redirigido al login automáticamente sin pérdida de datos en formularios.

4. La recuperación de contraseña funciona mediante el enlace enviado por email en menos de 5 minutos.

### **7.2.2 Registro de Jornada**

5. El Check-in registra la marca de tiempo exacta con precisión de segundos y el cronómetro inicia inmediatamente.

6. Al pausar, el cronómetro principal se detiene y el contador de pausas inicia correctamente.

7. Al retomar la jornada, el cronómetro de horas netas continúa desde el valor previo sin reiniciarse.

8. El Check-out finaliza la jornada, calcula horas netas correctamente y deshabilita todos los botones de acción.

9. Un intento de Check-in con jornada activa muestra un mensaje de error claro al usuario.

### **7.2.3 Reportes**

10. Los gráficos renderizan correctamente con datos de hasta 31 días en menos de 3 segundos.

11. La exportación CSV contiene todos los campos relevantes con formato de fecha ISO 8601\.

12. Los totales de horas coinciden con la suma manual de las jornadas individuales del período.

## **7.3 Restricciones de Proyecto**

* El proyecto debe desarrollarse sin costos de infraestructura adicionales al plan Supabase (plan Free o Pro según escala).

* La aplicación no debe depender de servicios de terceros distintos a Supabase para funcionalidades críticas.

* El código debe estar versionado en Git con ramas de desarrollo, staging y producción.

* Los datos de usuarios europeos deben cumplir con el RGPD, incluyendo el derecho al olvido y la portabilidad de datos.

## **7.4 Priorización de Requerimientos (MoSCoW)**

| Prioridad | Requerimientos |
| :---- | :---- |
| **Must Have** | RF-01 a RF-07 (Auth), RF-09 a RF-15 (Jornada), RF-19 a RF-21 (Dashboard), RF-25 a RF-27 (Reportes básicos), RF-32 a RF-36 (Admin esencial) |
| **Should Have** | RF-03 (OAuth), RF-17 (Edición admin), RF-28 (Export CSV), RF-29 (Comparativa), RF-38 a RF-40 (Perfil) |
| **Could Have** | RF-16 (Notas), RF-23 (Alertas), RF-30 (Reportes admin), RF-37 (Notificaciones) |
| **Won't Have (v1)** | RF-31 (PDF), RF-41 (Multiidioma), integración con ERP o sistemas de nómina externos |

*Documento generado — Aplicación de Control Horario Laboral v1.0 — Febrero 2026*