import moment from 'moment';
import {
  createLogger, config, format, transports,
} from 'winston';
import { RESET, DIM } from '@utils/ansi-style-codes';

const logTemplate = format.printf(({
  level, message, timestamp,
}) => {
  const formattedTimestamp = moment(timestamp).format('YYYY/MM/DD - hh:mm:ss');
  const colorizedTimestamp = `${DIM}${formattedTimestamp}${RESET}`;
  return `[${level}] | ${colorizedTimestamp} | ${message}`;
});

export const logger = createLogger({
  levels: config.syslog.levels,
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    logTemplate,
  ),
  transports: [
    new transports.Console({
      silent: process.argv.indexOf('--silent') >= 0,
    }),
  ],
});
