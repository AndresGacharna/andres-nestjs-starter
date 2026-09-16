# Pendientes de la plantilla

> Lo que **no** viene resuelto en la base, porque depende del alcance de cada proyecto o requiere una decisión. Revísalo al arrancar un proyecto nuevo y borra de esta lista lo que no aplique.

## Antes del primer despliegue

- [ ] **Migraciones en lugar de `synchronize`.** Hoy `synchronize` está activo en `development`. Con datos reales puede borrar columnas al renombrar un campo. Configurar un `DataSource` para la CLI de TypeORM y scripts `migration:generate` / `migration:run`.
- [ ] **SSL de la base de datos.** `ssl` se envía siempre, incluso sin `PG_SSL_CA` (con `rejectUnauthorized: false`). Contra un Postgres local sin SSL la conexión falla. Hacerlo condicional, por ejemplo con `DB_SSL=true|false`.
- [ ] **Zona horaria.** `main.ts` fija `process.env.TZ = 'America/Bogota'` *después* de crear la app, así que los logs del arranque salen en UTC; la sesión de Postgres es UTC. Lo recomendable: guardar todo en UTC con columnas `timestamptz` y convertir solo al mostrar, y mover o eliminar el `process.env.TZ`.
- [ ] **CORS con varios orígenes.** `FRONT_HOST` admite uno solo. Si hay varios ambientes, cambiarlo a una lista separada por comas y validada.

## Con los primeros módulos

- [ ] **`BaseEntity` común** en `common/entities/base.entity.ts` con `@CreateDateColumn`, `@UpdateDateColumn` y, si aplica, `@DeleteDateColumn` para borrado lógico.
- [ ] **Paginación para consultas por `POST`:** `PaginationDto`, `PagedDto<T>` y el filtro base en `common/dto/`, con límites (`@Max`) en `size`, y el resultado tipado como `PaginatedResult<T>` (`{ page, size, count, rows: T[] }`). Acordar el nombre de la ruta (`POST /<recurso>/search`).
- [ ] **Swagger** (`@nestjs/swagger`) documentando las dos formas de respuesta exitosa (resultado directo en consultas y `{ message, data? }` en acciones) y `ApiErrorResponse`.
- [ ] **Autenticación y autorización:** guards JWT y de roles con decoradores `@Auth(...)` / `@Roles(...)`.
- [ ] **Transacciones** (`dataSource.transaction(...)`) para operaciones que escriben varias tablas.

## Operación y calidad

- [ ] **Apagado ordenado:** `app.enableShutdownHooks()` en `main.ts`.
- [ ] **Health checks** con `@nestjs/terminus` (`/health` con ping a la BD) para el orquestador.
- [ ] **Seguridad HTTP:** `helmet` y `@nestjs/throttler` para limitar la tasa de peticiones.
- [ ] **Logging estructurado** (pino) con un `requestId` por petición, enviado en un header de respuesta y en el body de los errores, para reemplazar la búsqueda por `timestamp` + `path`.
- [ ] **Idioma de los mensajes.** Los catálogos de errores (`*.exception-response.ts`) y de éxito (`*.messages.ts`) están en inglés. Si el frontend los muestra tal cual, definir el idioma; como la respuesta de error no lleva `code`, el frontend decide por `statusCode`, no por el texto.

## Mantenimiento de la plantilla

- [ ] **Reglas de lint con tipos** (`no-floating-promises`, etc.) están declaradas en `.oxlintrc.json` pero inactivas: oxlint las necesita con TypeScript 7 y Nest 12 usa TypeScript 6.
- [ ] **TypeORM 1.x**: la plantilla usa TypeORM 0.3, soportado por `@nestjs/typeorm` 12. Subir a 1.x es opcional y tiene sus propios breaking changes.
