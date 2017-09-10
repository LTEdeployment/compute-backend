# Compute Backend

## Features

* Powered by `Express` `Node.js` `MongoDB` `Redis` `Python` `Scipy`.
* Provides LTE-user-radar interfernce compute and more ...
* Distributed-friendly compute compute-daemon seperate from web-backend.

## Development
```
npm install
npm run dev &
cd service/
./matdaemon &
./ltedaemon &
```

## Production
```
npm run docker-build
npm run docker-run
```

## Requirements

* NPM v3
* Node v6

## License

MIT
