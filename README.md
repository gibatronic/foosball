# Foosball

> Table football, table soccer, babyfoot, kicker, calciobalilla, biliardino, futbolín, totó, pebolim, pacal, matraquilhos, matrecos.

Raspberry Pi project to keep track of scores in my foosball table.

## Enviroment Variables

You can set them in a `.env` file, at the root of the project:

```bash
# run mode, either development or production, affecting
# which configuration is loaded and if it should watch
# for file changes
ENVIRONMENT='development'

# where logs should be written to when running in
# production mode. defaults to a temporary file
LOG_FILE=''

# port number to listen to, set to zero for randomness
PORT='4269'

# project folder location inside the Raspberry Pi
UPLOAD_FOLDER='~/foosball'

# SSH destination to the Raspberry Pi
# works best with public key authentication
UPLOAD_SERVER='pi@raspberrypi.local'
```
