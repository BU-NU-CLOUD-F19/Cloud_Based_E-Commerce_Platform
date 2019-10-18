# Alpine is a minimal distro
FROM node:8.9-alpine

# Initialize app directory
ENV APP_DIR "/usr/app"

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

# PM2 will be used as PID 1 process.
# It's a process manager for Node, and it'll run the service.
RUN npm install -g pm2@3.5.1

# Copy content
# Should also set up dev vs production - bind mounts vs copying.
# Currently we're mounting the code dir on the container fs, which isn't good for production.
# In production, the code should be copied into the app dir and there should be no bind mounts.
# eg: COPY "." "$APP_DIR"
# See here https://hackernoon.com/how-to-move-code-into-a-docker-container-ab28edcc2901

COPY package*.json ./
RUN npm install

# Setup ports
ENV API_PORT 3000
EXPOSE $API_PORT

# Run it
# Start PM2 as PID 1 process
ENTRYPOINT ["pm2", "--no-daemon", "start"]

# Actual script to start can be overridden from `docker run`
# you can pass in env to load,
# e.g. "process.json", "--env", "production" will load production environment
# process.json defines the pm2 process to be executed
CMD ["process.json"]
