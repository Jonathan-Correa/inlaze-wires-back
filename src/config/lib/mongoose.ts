import mongoose from 'mongoose';
import { Connection } from 'mongoose';
var _db: DbConfig;
import chalk from 'chalk';
import { DbConfig } from '../../interfaces/IConfig';

class Mongoose {
  private connection: Connection = mongoose.connection;

  async InitDb() {
    const { db } = await import(`../env/${process.env.NODE_ENV}`);
    _db = db;
  }

  constructor() {
    this.InitDb().then(async () => {
      await mongoose.connect(_db.uri, _db.options);
      this.connection = mongoose.connection;
      this.connection.once('open', () => {
        console.log(chalk.green('MongoDB is connected'));
      });

      this.connection.on('error', (err) => {
        console.log(chalk.green(`Mongo error: ${err}`));
      });
    });
  }

  public getConnection(): Connection {
    return this.connection;
  }
}

export default new Mongoose().getConnection();
