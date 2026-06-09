-- init.sql — Configuración inicial ejecutada por docker-compose
-- NOTA: La DB y el usuario ya son creados por las env vars de docker-compose
-- Este archivo se ejecuta automáticamente en el primer inicio del contenedor

-- Otorgar permisos adicionales si es necesario
GRANT ALL PRIVILEGES ON DATABASE techstore TO techstore_user;
