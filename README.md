# Task management dashboard

# Getting Started

### Install all necessary packages

```bash
# run in terminal
$ npm install
```

### Env setup

Copy `.env.example` to `.env` and populate it with the missing/relevant environment variables.

### Storage launch

#### Using Docker

If you have `Docker` installed on your machine just run `docker compose up` to launch development and test DBs.
(use separate terminal since services are running in attached mode)

#### Without Docker

Since app is using `PostgreSQL`, download latest version of PostgreSQL from [here](http://postgresql.org/download/) to your computer and install it.
Next, launch 2 databases (using `psql` or similar tool) with credentials identical to those you can find in the `docker-compose.yml` file.

### Run migrations

1. When db launched run migrations on db(this will clear db and run all existing migrations), using:

```bash
$ npm run db:reset
```

## Testing

Unfortunately didn't have enough time to implement:( Could be done using `playwright`, `jest` , etc...).
Read more: https://nextjs.org/docs/app/building-your-application/testing/playwright
