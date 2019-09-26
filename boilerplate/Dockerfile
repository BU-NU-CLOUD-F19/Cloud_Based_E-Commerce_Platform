FROM node:8.9-alpine

# Initialize app directory
ENV APP_DIR "/usr/app"
ENV PYTHONPATH="/:${PYTHONPATH}"

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

#PM2 will be used as PID 1 process
RUN npm install -g pm2@1.1.3

# for converting files to unix(CRLF)
RUN apk add dos2unix --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted

# Copy content
COPY "." "$APP_DIR"

RUN apk --no-cache --virtual build-dependencies add \
  python \
  make \
  g++ \
  && npm i \
  && apk del build-dependencies \
  && apk del dos2unix

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
