import path from 'path';
import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import passport from '../users.config';
import connection from './mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { InitRoutes } from '../../routes/index';
import chalk from 'chalk';
import { initHelmet } from './helmet';
const {
  sessionConfig,
  config,
  helmetConfig,
  db,
} = require(`../env/${process.env.NODE_ENV}`);

class Express {
  // Initialize middlewares
  private initMiddlewares(app: Application): void {
    app.use(express.static(path.join(path.resolve('./'), 'build/public')) as any);
    app.use(express.json() as any);
    app.use(
      express.urlencoded({
        extended: true,
      }) as any
    );

    // Log requests only on development environment
    if (config.env === 'development') {
      app.use(morgan('dev') as any);
      app.use(
        cors({
          origin: config.frontUri,
        })
      );
    }

    // Compress the body of the request
    app.use(compression());

    // Security middlewares
    initHelmet(app, helmetConfig);

    // Session and login middlewares
    this.initSession(app);
    app.use(passport.initialize());
    app.use(passport.session());

    // Initialize app routes
    new InitRoutes(app);
  }

  private initSession(app: Application): void {
    const MongoStore = connectMongo(session);
    sessionConfig.store = new MongoStore({
      mongooseConnection: connection,
      ttl: 1000 * 60 * 60 * 24,
    });
    app.use(session(sessionConfig));
  }

  public start(app: Application) {
    this.initMiddlewares(app);

    app.listen(process.env.PORT, () => {
      console.log(chalk.green('------'));
      console.log(chalk.green('--Server on port: ' + config.port));
      console.log(chalk.green('--Environment   : ' + config.env));
      console.log(chalk.green('--Database      : ' + db.uri));
      console.log(chalk.green('------'));
    });
  }
}

export const server = new Express();
