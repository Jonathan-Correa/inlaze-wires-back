import express from 'express';
import path from 'path';
import { config } from 'dotenv';
// Load Enviroment variables
config({ path: path.join(path.resolve('./'), '.env') });
import { server } from './config/lib/express';

server.start(express());

