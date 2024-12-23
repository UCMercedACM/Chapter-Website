FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  tini \
  && apt-get clean

WORKDIR /website
COPY . /website

RUN adduser --disabled-password --gecos "" website \
  && chown -R website:website /website/

USER website

RUN npm ci --ignore-scripts \
  && npm run build

EXPOSE 3000

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["npm", "run", "serve"]

STOPSIGNAL SIGTERM

HEALTHCHECK --interval=5m --timeout=3s CMD ["curl", "-f" , "http://localhost:3000/", "||", "exit 1"]

LABEL org.opencontainers.image.title="Chapter-Website"
LABEL org.opencontainers.image.description="ACM @ UC Merced's website"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.source="https://github.com/UCMercedACM/Chapter-Website"
