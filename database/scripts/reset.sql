-- Reset completo de la base de datos
-- Reconstruye desde cero todas las tablas, enums y datos

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO techstore_user;
GRANT ALL ON SCHEMA public TO public;
