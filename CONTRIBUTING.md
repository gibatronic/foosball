# Contributing

Project documentation to quickly get started hacking it.

## Hardware

* Any [Raspberry Pi](https://www.raspberrypi.com/products/) model.<br>Other hardware platforms may be used if [`DriverService`](source/driver/driver.service.ts) gets updated.
* 2x [infrared break bean](https://www.adafruit.com/product/2168) sensors.<br>Bind the chosen pin with a team in [`config.yaml`](source/config/config.yaml)<br>Depending on the table, something else might be better to detect goals.

## Software

* [Raspberry Pi OS](https://www.raspberrypi.com/software/) or any operating system capable of running [Node.js](https://nodejs.org/) ecosystem.
* [Node.js](https://nodejs.org/) 16 with [npm](https://github.com/npm/cli) 8

### Tech stack

* [Jest](https://jestjs.io/) test framework
* [NestJS](https://nestjs.com/) app framework
* [PM2](https://pm2.keymetrics.io/) process manager
* [rpio](https://github.com/jperkin/node-rpio) GPIO access
* [RxJS](https://rxjs.dev/) observables
* [Swagger UI](https://swagger.io/tools/swagger-ui/) OpenAPI

### Folder structure

```
.
├── source
│   │
│   ├── config
│   │   Per environment project settings
│   │
│   ├── driver
│   │   Hardware bridge to poll goal sensors
│   │
│   ├── event-emitter
│   │   Publish–subscribe event bus.
│   │
│   ├── exceptions
│   │   Error handler
│   │
│   ├── logger
│   │   Tool for logging messages
│   │
│   ├── scoreboard
│   │   View and API to display scores
│   │
│   ├── store
│   │   In-memory key-value map
│   │
│   └── teams
│       API to handle team data
│
├── tasks
│   Scripts for common tasks
│   Run `npm run` to list them
│
└── test
    End-to-end tests
```

### Enviroment variables

You can set them in a `.env` file, at the root of the project:

```bash
# run mode, either development or production, affecting
# which configuration is loaded and if it should watch
# for file changes
ENVIRONMENT='development'

# port number to listen to, set to zero for randomness
PORT='4269'

# project folder location inside the Raspberry Pi
UPLOAD_FOLDER='~/foosball'

# SSH destination to the Raspberry Pi
# works best with public key authentication
UPLOAD_SERVER='pi@raspberrypi.local'
```

### Setup and run

After creating the `.env` file, run:

```bash
# install packages
npm install

# start the app
npm start
```

Then, open in a browser:

* `http://localhost:4269/` for the live scoreboard
* `http://localhost:4269/api` for the OpenAPI documentation
