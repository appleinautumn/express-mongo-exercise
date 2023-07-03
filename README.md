# Express Mongo Exercise

This service is to demonstrate a REST service with Express and MongoDB. Authentication with JWT and refresh token.

Features:

- Admin can list, create, update, delete users.
- User can get their profile.
- User can login.
- User can refresh token.

Credentials:
| Username | Password | Role |
|:-----------------:|:---------:|:-------:|
| boss@test.com | boss | admin |
| alibaba@test.com | alibaba | user |

Flowchart of the use cases: https://whimsical.com/sejutacitatest-EsJNQMbPuHHxou7oxve1kc

API documentation: https://documenter.getpostman.com/view/3021947/TzzGGDQh

## Requirements

This project is developed with:

- Node 18
- MongoDB 6.0

## Installation

Clone the project

```bash
git clone git@github.com:appleinautumn/express-mongo-exercise.git
```

Go to the project directory

```bash
cd express-mongo-exercise
```

This service contains a `.env.example` file that defines environment variables you need to set. Copy and set the variables to a new `.env` file.

```bash
cp .env.example .env
```

Start the app

```bash
npm run dev
```

## Database

Create a MongoDB database. And then get the seed data from `data` directory. And import it with the following command.

```
mongoimport --db=<database_name> --collection=users --type=json --file=users.json
```

## Deployment

### Without Docker

Follow the Installation instruction above

### With Docker

Build the image

```bash
docker build -t express-mongo-exercise .
```

Run the container

```bash
docker run -d --name express-mongo-exercise1 -p 3001:3000 --network=host --env-file=.env express-mongo-exercise
```
