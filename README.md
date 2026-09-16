# andres-nestjs-starter

Plantilla base para arrancar APIs con [NestJS](https://nestjs.com/) 12 (ESM), TypeORM y PostgreSQL, con el cableado transversal ya resuelto y un módulo de ejemplo con CRUD completo.

Lo que viene listo:

- **Contrato de respuestas único.** Las consultas devuelven el resultado tal cual; las acciones devuelven `{ message, data? }` sin que el controlador arme nada.
- **Manejo de errores global.** `AllExceptionsFilter` con un formato único, `DomainException(status, message)` con catálogos de mensajes por módulo, y los errores de Postgres traducidos (duplicados y llaves foráneas → `409`) sin filtrar detalles internos.
- **Configuración validada al arrancar.** `EnvironmentVariables` + `validateEnv`: si falta una variable o el valor es inválido, la app no levanta y dice cuáles.
- **Logging y serialización globales.** Sin `new Logger()` ni `ClassSerializerInterceptor` por controlador.
- **Las convenciones como skill de agente**, para que el módulo 20 se escriba igual que el primero.

> **Sobre el origen.** La arquitectura y las convenciones de esta plantilla son mías. Se construyeron tomando como referencia convenciones de equipo y la skill de terceros [`nestjs-best-practices`](https://github.com/kadajett/agent-nestjs-skills) (de `kadajett`, que **no** se redistribuye en este repo: ver [Skills de agente](#skills-de-agente)), pero las decisiones, el código y la skill `andres-nestjs-architecture` son propios.

## Cómo arrancar un proyecto nuevo

```bash
# Opción A: como template de GitHub (una vez que este repo esté marcado como template)
gh repo create mi-api-nueva --template AndresGacharna/andres-nestjs-starter --private --clone

# Opción B: copia sin historial
npx degit AndresGacharna/andres-nestjs-starter mi-api-nueva
cd mi-api-nueva && git init && git add -A && git commit -m "chore: initial commit from starter"
```

### Qué renombrar después de copiar

1. `package.json`: `name`, `description`, `author`.
2. `src/config/database.config.ts`: `applicationName` (sale en `pg_stat_activity`, sirve para saber qué API tiene abierta cada conexión).
3. Borra `src/product/` y quita `ProductModule` de `src/app.module.ts` cuando escribas el primer módulo real.
4. `.env.template` → `.env` con los valores del proyecto.
5. Instala la skill `nestjs-best-practices` si la quieres (ver [Skills de agente](#skills-de-agente)).

## Requisitos

- **Node.js `^22.22.3`, `^24.15.0` o `>=26.0.0`** (los que pide el CLI de Nest 12). Verifica con `node -v`.
- **pnpm** vía Corepack:
  ```bash
  corepack enable
  corepack prepare pnpm@12.4.1 --activate
  ```
  Si `corepack prepare` falla con un error de verificación de firma (`Cannot find matching keyid`), actualiza Corepack con `npm install -g corepack@latest`, o instala pnpm directo con `npm install -g pnpm@12.4.1`.
- PostgreSQL accesible con las credenciales del `.env`.

## Instalación y ejecución

```bash
pnpm install
cp .env.template .env   # y llena los valores
pnpm run start:dev
```

La API queda en `http://localhost:3033/api/v1` (configurable con `PORT`).

En `development`, TypeORM tiene `synchronize` activo: las tablas se crean solas a partir de las entidades. **Antes de tener datos reales, cámbialo por migraciones** (ver [`docs/pendientes.md`](docs/pendientes.md)).

```bash
pnpm run start          # sin watch
pnpm run start:debug    # debug
pnpm run build && pnpm run start:prod
```

## Lint, formato y tests

```bash
pnpm run lint       # oxlint (config en .oxlintrc.json)
pnpm run lint:fix
pnpm run format     # prettier
pnpm run test       # vitest, src/**/*.spec.ts
pnpm run test:e2e   # vitest, test/**/*.e2e-spec.ts
```

La plantilla no trae tests: `pnpm run test` no encuentra archivos hasta que escribas el primero. Ojo al hacerlo: Vitest transpila sin emitir metadatos de decoradores, así que para `Test.createTestingModule` con inyección por constructor hace falta un plugin SWC (`unplugin-swc`).

## El módulo de ejemplo

`src/product/` es un CRUD completo escrito con las convenciones de la skill. Sirve de referencia viva —compila y corre— y ejercita todo el contrato:

| Endpoint | Qué demuestra |
|---|---|
| `GET /api/v1/products` | Consulta: resultado tal cual, sin mensaje |
| `GET /api/v1/products/:id` | `404` con el mensaje de `ProductExceptionResponse.NOT_FOUND` si no existe |
| `POST /api/v1/products` | Acción: `{ message, data }`. `409` con mensaje propio del módulo si el `sku` se repite |
| `PATCH /api/v1/products/:id` | Acción con `PartialType` del DTO de creación |
| `PATCH /api/v1/products/:id/deactivate` | Acción que no es CRUD + regla de negocio que lanza |
| `DELETE /api/v1/products/:id` | Acción sin retorno: `200` con `{ message }` |

El campo `internalNotes` de la entidad lleva `@Exclude()`: nunca sale en las respuestas. Es la prueba de que el `ClassSerializerInterceptor` global está haciendo su trabajo.

### Contrato de respuestas

| Tipo de endpoint | Respuesta |
|---|---|
| Consulta (`GET`, o `POST` de búsqueda) | El resultado tal cual: entidad, arreglo o `{ page, size, count, rows }` |
| Acción que devuelve algo | `{ "message": "...", "data": ... }` |
| Acción que no devuelve nada | `{ "message": "..." }` |
| Error | `{ "statusCode", "message", "timestamp", "path" }` |

```bash
# Acción → 201 { message, data }
curl -X POST http://localhost:3033/api/v1/products \
  -H 'Content-Type: application/json' \
  -d '{"sku":"ABC-001","name":"Ejemplo"}'

# Consulta → 200, el arreglo tal cual
curl http://localhost:3033/api/v1/products
```

## Skills de agente

Dos skills, con orígenes y tratamientos distintos:

**`andres-nestjs-architecture`** — propia, MIT, versionada en `.claude/skills/` para que la plantilla funcione recién clonada. Las convenciones de este repo más una plantilla completa de módulo en `references/module-template.md`.

Su repo canónico es [`andres-nest-agent-skills`](https://github.com/AndresGacharna/andres-nest-agent-skills), pensado para consumirla desde cualquier runtime de agentes (Claude Code, Codex, Antigravity, …). Si corriges una convención, corrígela allá y sincroniza la copia de aquí.

**`nestjs-best-practices`** — de terceros: [`kadajett/agent-nestjs-skills`](https://github.com/kadajett/agent-nestjs-skills). **No se redistribuye en este repo**, porque ese proyecto no declara licencia y sin licencia el default es *todos los derechos reservados*. `skills-lock.json` guarda el origen, la ruta y el hash; instálala tú si la quieres:

```bash
git clone --depth 1 https://github.com/kadajett/agent-nestjs-skills /tmp/agent-nestjs-skills
mkdir -p .agents/skills
cp -r /tmp/agent-nestjs-skills/skills/nestjs-best-practices .agents/skills/
```

Después enlázala para que Claude Code la lea (el enlace **no** se commitea; en Windows git lo guardaría como copia duplicada):

```bash
# Windows (PowerShell)
New-Item -ItemType Junction -Path .claude/skills/nestjs-best-practices -Target .agents/skills/nestjs-best-practices

# macOS / Linux
ln -s ../../.agents/skills/nestjs-best-practices .claude/skills/nestjs-best-practices
```

Ante un conflicto entre las dos, manda `andres-nestjs-architecture`.

## Convenciones de ESM

El proyecto es un ES module (`"type": "module"`). Se configura una vez para todo el proyecto, pero implica dos reglas al escribir código:

1. **Los imports relativos terminan en `.js`**, aunque el archivo sea `.ts` (la extensión se refiere al compilado):
   ```ts
   import { ProductService } from './services/product.service.js'; // ✅
   import { ProductService } from './services/product.service'; // ❌ falla en runtime
   ```
   Los imports de paquetes (`@nestjs/common`, `typeorm`, ...) no cambian. `nest g` ya genera la extensión.
2. **Las relaciones de TypeORM se tipan con `Relation<T>`**, para evitar `Cannot access 'X' before initialization` cuando dos entidades se importan entre sí:
   ```ts
   import { type Relation } from 'typeorm';

   @ManyToOne(() => Company)
   company!: Relation<Company>;
   ```

Además, `__dirname` y `__filename` no existen en ESM: usa `import.meta.dirname` e `import.meta.filename`.

## Siguientes pasos

[`docs/pendientes.md`](docs/pendientes.md): lo que conviene resolver en cada proyecto nuevo según su alcance (migraciones, `BaseEntity`, paginación, Swagger, autenticación, health checks).
