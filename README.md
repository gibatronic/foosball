# Foosball

> Table football, table soccer, babyfoot, kicker, calciobalilla, biliardino, futbolín, totó, pebolim, pacal, matraquilhos, matrecos.

## Enviroment Variables

A `.env` file, at the root of the project folder, should contain the following enviroment variables:

```bash
# run mode, either development or production
ENVIRONMENT='development'

# where logs get written to, only when running in
# production mode. defaults to a temporary file
LOG_FILE=''

# port number to listen to
PORT='4269'

# Raspberry Pi's project folder
UPLOAD_FOLDER='~/foosball'

# Raspberry Pi's SSH destination
UPLOAD_SERVER='foosball'
```
