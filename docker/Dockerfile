FROM node:24-trixie-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl libatomic1  \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /website

# The official ghcr.io:pnpm/pnpm image symlinks the binary to /usr/local/bin
# as it is first installed into /opt/pnpm/bin instead
# See: https://github.com/pnpm/pnpm/blob/main/docker/Dockerfile#L37
RUN curl -fsSL https://get.pnpm.io/install.sh | PNPM_HOME=/opt/pnpm SHELL="$(which bash)" bash -
RUN ln -s /opt/pnpm/bin/pnpm /usr/local/bin/pnpm

# Install dependencies first (cached unless manifests change)
COPY package.json pnpm-lock.yaml /website/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --trust-lockfile --ignore-scripts

# Copy necessary build configurations
COPY vite.config.ts index.html tsconfig.json tsconfig.app.json tsconfig.node.json docker/nginx.conf /website/
COPY public /website/public
COPY src /website/src

ARG VITE_API_URL=/api
ARG VITE_ORY_URL=/auth

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ORY_URL=$VITE_ORY_URL

# Now build for optimal caching
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:stable-alpine-slim

ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

COPY --from=build /website/dist /usr/share/nginx/html
COPY --from=build /website/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=5m --timeout=3s CMD wget -q -O /dev/null http://localhost:8080/ || exit 1

LABEL org.opencontainers.image.title="Chapter-Website"
LABEL org.opencontainers.image.description="ACM @ UC Merced's website"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.source="https://github.com/UCMercedACM/Chapter-Website"
