# --- Fase 5: imagen de desarrollo de ANA-Frontend-Web ---
# (En la Fase 8 añadiremos una etapa de build + Nginx para producción)

FROM node:22-slim

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

# --host expone el dev server en 0.0.0.0 (todas las interfaces), no solo
# 127.0.0.1 — imprescindible para que sea alcanzable desde fuera del contenedor.
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
