# Postgres container with web interface

## Running the container

Build, recreate, and run the containers in the background:

```bash
docker-compose up -d
```

Start the containers (after stopping):

```bash
docker-compose start
```

## Stopping the container

To stop the container:

```bash
docker-compose stop
```

To stop and remove the container (add `-v` to include volumes):

```bash
docker-compose down
```

## Accessing the containers

Web interface: [http://localhost:5050](http://localhost:5050)

Postgres database: localhost:5432

`psql` command line:

```bash
docker exec -it postgres psql -U postgres
```

## Dump & restore database data

Backup:

```bash
docker exec -t -u postgres postgres pg_dumpall -c > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
```

Restore:

```bash
cat dump_name.sql | docker exec -i postgres psql -Upostgres
```

# `pg_cron` and cron jobs for the database
## Setup, configuration
We use [pg_cron](https://github.com/citusdata/pg_cron) for database-level automation, in the style of UNIX cron jobs.

The base image is the [official PostgreSQL Docker image](https://hub.docker.com/_/postgres), which we then extend to also contain `pg_cron`.
The installation of `pg_cron` is done in the Dockerfile.
We also copy a custom `postgresql.conf` file into the image, where the only difference is that the variable `shared_preload_libraries` contains `pg_cron`, and the variable `cron.database_name` is set to `postgres`, which means that pg_cronjobs will be stored and read from the `postgres` database (but can act on any specified database). The file is placed at `/etc/postgresql/postgresql.conf` in the container, which is the default location as per the PostgreSQL image's documentation.

Finally, in the database initialization script, we run the commands `\connect postgres` and `create extension pg_cron` to switch to the `postgres` database and enable the `pg_cron` extension in that database.

## Creating the job
Every new job is inserted into the table `cron.job` in the `postgres` database.

When inserting a new job, we specify four things - the schedule, command, database, and port.
The schedule is in the format of a UNIX crontab schedule, so since we want this job to run every minute, the field would contain the string `'* * * * *'` (for more explanation of the crontab format, see e.g. [crontab.guru](https://crontab.guru/)).
The command is the SQL command that we want to run, in this case one that unlocks every cart that's been in the checkout phase for over ten minutes, and sets its checkout date to NULL.
The database is the name of the database that we want to affect, in our case `'cloud_ecommerce'`.
Finally, the port is the port on which the PostgreSQL server is running, which is set from an environment variable, `$POSTGRES_PORT`.
