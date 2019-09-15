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
