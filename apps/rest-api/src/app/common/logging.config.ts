import { format, transports } from 'winston';

const colorizer = format.colorize();
const processIdFormat = format((info) => {
  info.processId = colorizer.colorize(info.level, `[NEST] ${process.pid}`);
  return info;
});

const levelFormat = format((info) => {
  info.level = colorizer.colorize(info.level, info.level.toLocaleUpperCase());
  return info;
});

const contextFormat = format((info) => {
  info.context = colorizer.colorize('warn', `[${info.context || ''}]`);
  return info;
});

const messageFormat = format((info) => {
  info.message = colorizer.colorize(info.level, info.message);
  return info;
});

const msFormat = format((info) => {
  info.ms = colorizer.colorize('warn', info.ms);
  return info;
});

export const winstonConfig = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'dd/MM/YYYY, hh:mm:ss' }),
        format.ms(),
        processIdFormat(),
        contextFormat(),
        messageFormat(),
        msFormat(),
        levelFormat(),
        format.printf((info) => {
          return `${info.processId} ${info.timestamp} ${info.level} ${info.context} ${info.message} ${info.ms}`;
        })
      ),
    }),
    new transports.File({
      level: 'debug',
      format: format.combine(format.ms(), format.timestamp(), format.json()),
      filename: 'rest-api.debug.log',
    }),
    new transports.File({
      level: 'info',
      format: format.combine(
        format.ms(),
        format.timestamp(),
        format.colorize(),
        format.json()
      ),
      filename: 'rest-api.error.log',
    }),
    new transports.File({
      level: 'error',
      format: format.combine(
        format.ms(),
        format.timestamp(),
        format.colorize(),
        format.json()
      ),
      filename: 'rest-api.error.log',
    }),
  ],
};
