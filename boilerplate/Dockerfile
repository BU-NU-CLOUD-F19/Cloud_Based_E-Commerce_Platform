FROM node:8.9-alpine

# Initialize app directory
ENV APP_DIR "/usr/app"

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

#PM2 will be used as PID 1 process
RUN npm install -g pm2@3.5.1

# for converting files to unix(LF)
RUN apk add dos2unix --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted

# Copy content
COPY "." "$APP_DIR"

RUN npm i && apk del dos2unix

# Setup ports
ENV API_PORT 3000
EXPOSE $API_PORT

# Run it
# Start PM2 as PID 1 process
ENTRYPOINT ["pm2", "--no-daemon", "start"]

# Actual script to start can be overridden from `docker run`
# you can pass in env to load,
# e.g. "process.json", "--env", "production" will load production environment
CMD ["process.json"]
