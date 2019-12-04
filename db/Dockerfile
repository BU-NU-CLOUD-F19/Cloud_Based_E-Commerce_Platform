# Build on top of postgres based on alpine (minimal)
FROM postgres:12-alpine

# Install pg_cron
RUN set -ex \
      && PG_CRON_VERSION=1.2.0 \
      && apk add --no-cache --virtual .build-deps build-base ca-certificates openssl tar clang llvm8 \
      && wget -O /pg_cron.tgz https://github.com/citusdata/pg_cron/archive/v$PG_CRON_VERSION.tar.gz \
      && tar xvzf /pg_cron.tgz && cd pg_cron-$PG_CRON_VERSION \
      && sed -i.bak -e 's/-Werror//g' Makefile \
      && sed -i.bak -e 's/-Wno-implicit-fallthrough//g' Makefile \
      && make && make install \
      && cd .. && rm -rf pg_cron.tgz && rm -rf pg_cron-*

# Copy the postgresql.conf file modified for pg_cron
COPY ./postgresql.conf /etc/postgresql/postgresql.conf
RUN chown -R postgres:postgres /etc/postgresql && chmod 0700 /etc/postgresql
