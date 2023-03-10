import { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { StrictTransportSecurityOptions } from 'helmet/dist/middlewares/strict-transport-security';

export const initHelmet = (
  app: Application,
  config: StrictTransportSecurityOptions
): void => {
  app.use(helmet.frameguard() as any);
  app.use(helmet.xssFilter() as any);
  app.use(helmet.noSniff() as any);
  app.use(helmet.ieNoOpen() as any);
  app.use(helmet.hsts(config) as any);
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('X-powered-by', 'Cole Train');
    next();
  });
};
