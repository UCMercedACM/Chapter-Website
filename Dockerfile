# base image
FROM node:12.2.0

# install chrome for protractor tests
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update 
RUN apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm i -g yarn
RUN yarn install

# Get all the code needed to run the app
COPY . /app/

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["yarn", "start"]