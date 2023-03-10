import { asyncForEach } from '../helpers/global-helpers';

import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

config({ path: path.join(__dirname, '../../.env') });

const { db } = require(`../config/env/${process.env.NODE_ENV}`);

const seed = async () => {
  await mongoose.connect(db.uri, db.options);

  const files = fs.readdirSync(__dirname + '/data/');
  await asyncForEach(files, async (file: string) => {
    const { seed } = await require(`./data/${file}`);
    await seed();
  });
};

seed();
