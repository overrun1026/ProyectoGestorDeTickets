
-- Este archivo inserta categorías de ejemplo para el entorno de desarrollo
-- y puede ejecutarse varias veces sin duplicar las categorías.
INSERT INTO categories (name, description)
VALUES
    ('Acceso a la cuenta', 'Problemas de inicio de sesión y acceso'),
    ('Error técnico', 'Errores y fallos de la aplicación'),
    ('Software', 'Instalación y funcionamiento de programas'),
    ('Hardware', 'Problemas con equipos y periféricos'),
    ('Otros', 'Solicitudes que no encajan en otras categorías')
ON CONFLICT (name) DO NOTHING;
