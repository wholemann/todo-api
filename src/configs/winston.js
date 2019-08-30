import fs from 'fs';
import winston from 'winston';

const logDir = `${__dirname}/../logs`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const infoTransport = new winston.transports.File({
  filename: 'info.log',
  dirname: logDir,
  level: 'info',
});

const errorTransport = new winston.transports.File({
  filename: 'error.log',
  dirname: logDir,
  level: 'error',
});

const logger = winston.createLogger({
  transports: [infoTransport, errorTransport],
});

// if(process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
// }

const stream = {
  write: (message) => {
    logger.info(message);
  },
};

export { logger, stream };
