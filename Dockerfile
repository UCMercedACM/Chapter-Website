# base image
FROM node:12.16.1

LABEL maintainer="UCM ACM Chapter"
LABEL maintainer.email="acm@ucmerced.edu"
LABEL version="0.3.1"

# install chrome for protractor tests
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update 
RUN apt-get install -yq google-chrome-stable

# use changes to package.json to force Docker not to use the cache
# when we change our application's angular dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && yarn install --silent
# RUN yarn global add --silent @angular/cli@8.3.14
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /app
COPY . /app

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["yarn", "docker"]

HEALTHCHECK --interval=5m --timeout=3s \
    CMD curl -f http://localhost/ || exit 1
