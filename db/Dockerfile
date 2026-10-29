
# Este archivo prepara la imagen de PostgreSQL con las migraciones SQL
# y los datos iniciales que se ejecutan al inicializar una base nueva.
FROM postgres:17-alpine

COPY migrations/*.sql /docker-entrypoint-initdb.d/
COPY seeds/development.sql /docker-entrypoint-initdb.d/007_development.sql
