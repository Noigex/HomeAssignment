# Instructions

Home assignment.

## Features

- RESTful API using [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/) as the SQL database of choice.
- [Prisma](https://www.prisma.io/) as the ORM of choice, for database modelling, migration and type-safe access (Postgres).
- Comprehensive end-to-end test coverage of all endpoints.
- (Optional) Docker-based PostgreSQL database instances.

> **NOTE:** Error handling is handled globally in the app on [prisma-client-exception.filter.ts](./src//prisma-client-exception//prisma-client-exception.filter.ts) to avoid unnecessarily bloated service's "try catch" blocks(try-catch blocks are omitted in service's).

## Overview

- [Instructions](#instructions)

  - [Features](#features)
  - [Overview](#overview)
  - Setup

    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Set up PostgreSQL databases](#2-set-up-postgresql-databases)

      - [Option 1 : PostgreSQL with Docker](#option-1--postgresql-with-docker)
      - [Option 2 : Install PostgreSQL Locally](#option-2--install-postgresql-locally)

    - [3. Deploy Migrations](#3-deploy-migrations)
    - [4. (Optional) Seed the database data with this script](#4-optional-seed-the-database-data-with-this-script)
    - [5. Start NestJS Server](#5-start-nestjs-server)

  - [End-to-End Test](#end-to-end-test)
  - [Error Handling](#error-handling)
  - [Front-End app Angular](#front-end-app-angular)

## 1. Install Dependencies

Install the dependencies for the Nest application:

```bash
# npm
npm install
# yarn
yarn install
```

## 2. Set up PostgreSQL databases

### - Option 1 : PostgreSQL with Docker

Make sure you have [docker](https://www.docker.com/) installed or install it.

Setup a development PostgreSQL with Docker:

1. Copy [.env.example](./.env.example) and rename to `.env` which sets the required environments for the PostgreSQL database, set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and `DB_PORT`. Update the variables as you wish.
2. Copy [.env.test.example](./.env.test.example) and rename to `.env.test` which sets the required environments for the PostgreSQL database used for Testing, Set: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and `DB_PORT`. Update the variables as you wish.

> **NOTE:** The `DB_PORT` variables must match the corresponding port within the docker-compose.yml file:  
> `.env` file matching the `postgres` container port,  
> and `.env.test` file matching the `postgres-test` container port.
> the default numbers that i provided are already matching.

Start the PostgreSQL database's(the script will boot up both the real database and the test database)

```bash
docker-compose up -d
# or
npm run start:docker:dbs
```

### - Option 2 : Install PostgreSQL Locally

Install [PostgreSQL](https://www.postgresql.org/) locally.

1. Copy [.env.example](./.env.example) and rename to `.env` which sets the required environments for the PostgreSQL database, set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and `DB_PORT`. Update the variables as you wish.
2. Copy [.env.test.example](./.env.test.example) and rename to `.env.test` which sets the required environments for the PostgreSQL database used for Testing, Set: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and `DB_PORT`. Update the variables as you wish.

> **NOTE:** The `DB_PORT` variables must match the port that your local PostgreSQL is listening to (Default is: 5432)

### 3. Apply Migrations

Prisma is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the [.env](./.env) file.  
The test scripts will read the `DATABASE_URL` from the [.env.test](./.env.test).  
This was achieved using the `dotenv-cli` package.

Apply Migrations to the database

```bash
npx prisma migrate dev
# or
npm run migrate:up
```

### 4. (Optional) Seed the database data with this script

By default when creating the database the tables will be empty, if you want to seed the tables with 2 Students and 2 Courses run the following command:

```bash
npm run seed
```

### 5. Start NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```

Run Nest Server in Production mode:

```bash
npm run build
npm run start:prod
```

## End-to-End Test

End-to-End test files are located in the [test](./test/) folder,  
These tests aim to comprehensively cover all endpoints, testing various possible outcomes.
Run this command:

```bash
npm run test:e2e
```

The script will automatically use the testing database and its `.env.test` variables file, delete the data in the tables and seed data to run the tests reliably.

## Error Handling

Error handling is handled globally in the app on [prisma-client-exception.filter.ts](./src//prisma-client-exception//prisma-client-exception.filter.ts) to avoid unnecessarily bloated service's "try catch" blocks,
There's also use of `Validation Pipes` in the dto's files in students folder and courses folder.

## Front-End app Angular

I Made an Angular app which give's the ability to interact with the Back-end endpoints of the NestJS home assignment.

Check it out in: [Client](../client/)
