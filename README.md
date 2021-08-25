# sejutacitatest microservice

Features:
* Admin can list, create, update, delete users.
* User can get their profile.
* User can login.
* User can refresh token.

Tested on node 16, mongo 4.2.8 locally, and Mongo Atlas.
Credentials:
| Username          | Password  | Role    |
|:-----------------:|:---------:|:-------:|
| boss@test.com     | boss      | admin   |
| alibaba@test.com  | alibaba   | user    |

API documentation: https://documenter.getpostman.com/view/3021947

### Running on your machine

In the main root directory, run:

```bash
node app.js
```

### Running on Docker

First build the image:
```bash
docker build -t sejutacitatest-microservice .
```

When ready, run it:
```bash
docker run -d --rm -p 3000:3000 --env-file=.env sejutacitatest-microservice
```
