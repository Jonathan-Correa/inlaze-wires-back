import { ConnectionOptions } from 'mongoose';

export interface DbConfig {
  uri: string;
  options: ConnectionOptions;
}

export interface IConfig {
  port: string;
  env: string;
  frontUri?: string;
}
