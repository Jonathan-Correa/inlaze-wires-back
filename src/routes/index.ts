import path from 'path';
import { Application, Router, Request, Response } from 'express';
import fs from 'fs';
import { asyncForEach } from '../helpers/global-helpers';
import { getErrorMessage } from '../helpers/error-handler';

const router = Router();
const files = fs.readdirSync(__dirname);

export class InitRoutes {
  private routing: Router[] = [];

  constructor(app?: Application) {
    if (app) {
      this.initRoutes()
        .then((routes: Router[]) => {
          this.routing = routes;

          this.routing.forEach((i) => {
            app.use(i);
          });

          router.get('/*', (req: Request, res: Response) => {
            return res.sendFile(
              path.join(__dirname, '../../build/public/index.html')
            );
          });

          app.use(router);
        })
        .catch((err) => console.error(err));
    }
  }

  public initRoutes = (): Promise<Router[]> => {
    return new Promise(async function (resolve, reject) {
      try {
        const routes: Router[] = [];
        await asyncForEach(files, async function (file: string) {
          if (file.indexOf('index') === -1) {
            const { router } = await import(`./${file}`);
            routes.push(router);
          }
        });
        return resolve(routes);
      } catch (err) {
        return reject(getErrorMessage(err));
      }
    });
  };

  public getRoutes = async (): Promise<any> => {
    const routers: any = [];
    return this.initRoutes().then((routes) => {
      // Get all the routes, this is used in "Groups" module.
      for (let i = 0; i < routes.length; i++) {
        for (let j = 0; j < routes[i].stack.length; j++) {
          routers.push(routes[i].stack[j]['route']);
        }
      }

      return routers;
    });
  };

  public getRouting(): Router[] {
    return this.routing;
  }
}
