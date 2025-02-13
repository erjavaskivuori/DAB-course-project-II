# Running the application

## Dev

To start with the development configuration run:

```
docker compose up
```

To stop the containers run:

```
docker compose down
```

## Production

Build the images

```
docker compose -f docker-compose.prod.yml up -d --build
```

To start with the production configuration run:

```
docker compose -f docker-compose.prod.yml up -d
```

To stop the containers run:

```
docker compose down
```

### Note

- Sometimes it takes a while for flyway to start the first run and migrations which leads into errors in backend and frontend, and no content shown in the frontend. This is usually fixed by itself in minute or so. Restarting the containers can also help.