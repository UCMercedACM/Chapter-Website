# base image
FROM node:12.16.1

# install chrome for protractor tests
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update 
RUN apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN yarn add --silent node-sass
RUN yarn install --silent
RUN yarn global add --silent @angular/cli@8.3.14

# add app
COPY . /app

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["yarn", "docker"]
