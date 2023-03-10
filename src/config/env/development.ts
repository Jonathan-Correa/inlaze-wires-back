import { SessionOptions } from 'express-session';
import { DbConfig, IConfig } from '../../interfaces/IConfig';

export const config: IConfig = {
  port: process.env.PORT || '3000',
  env: 'development',
  frontUri: process.env.FRONT_URI || 'http://localhost:4200',
};

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'name';

export const db: DbConfig = {
  uri: `mongodb://${dbHost}:${dbPort}/${dbName}-dev`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
};

export const mailer = {
  user: process.env.MAILER_USER || '',
  service: process.env.MAILER_SERVICE || 'Gmail',
  pass: process.env.MAILER_PASS || '',
};

const SIX_MONTHS = 15778476;
export const helmetConfig = {
  maxAge: SIX_MONTHS,
  includeSubDomains: true,
  force: true,
};

export const sessionConfig: SessionOptions = {
  saveUninitialized: false,
  resave: false,
  secret: process.env.SESSION_SECRET || 'secret',
  name: process.env.SESSION_NAME || 'name',
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
};
