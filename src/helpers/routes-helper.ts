// Modules
import { InitRoutes } from '../routes';
import Group from '../models/Group';
// Interfaces
import { NextFunction, Response } from 'express';
import { IRequest } from '../interfaces/IRequest';
import { IGroup } from '../interfaces/IGroup';

export const allowAccess = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<Response | NextFunction | undefined> => {
  if (!req.isAuthenticated() || !req.user)
    return res.status(401).json({ message: 'No estás autorizado' });

  const group = req.route.path.split('/')[2];
  const path = req.route.path;
  const method = req.method.toLowerCase();

  await Group.findOne({ _id: req.user?.group_id })
    .then((dbGroup: IGroup | null) => {
      if (!dbGroup)
        return res.status(403).json({ message: 'No estás autorizado' });

      if (
        Object.prototype.hasOwnProperty.call(dbGroup.options, group) &&
        dbGroup.options[group][path][method]
      ) {
        return next();
      }

      return res.status(403).json({ message: 'No estás autorizado' });
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: err.message });
    });
};

export const getAllRoutes = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any | Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const router = new InitRoutes();
  const routes = await router.getRoutes();
  const obj: Record<string, Record<string, Record<string, boolean>>> = {};

  for (const key in routes) {
    const split: string[] = routes[key].path.split('/');
    const path: string = routes[key].path;

    if (path === undefined || path === '') continue;
    if (split[1] !== 'api') continue;
    if (
      !split[2] ||
      split[2] === '' ||
      split[2] === '*' ||
      split[2] === 'auth'
    ) {
      continue;
    }

    for (const method in routes[key].methods) {
      if (!Object.prototype.hasOwnProperty.call(routes[key].methods, method))
        continue;

      if (!Object.prototype.hasOwnProperty.call(obj, split[2]))
        obj[split[2]] = {};
      if (!Object.prototype.hasOwnProperty.call(obj[split[2]], path))
        obj[split[2]][path] = {};
      if (method === '_all') continue;

      if (options) {
        obj[split[2]].module = options[split[2]]
          ? options[split[2]].module
          : false;

        if (!options[split[2]]) {
          obj[split[2]][path][method] = false;
          continue;
        }

        obj[split[2]][path][method] = Object.prototype.hasOwnProperty.call(
          options[split[2]],
          path
        )
          ? options[split[2]][path][method]
          : false;
      } else {
        obj[split[2]][path][method] = false;
      }
    }
  }

  return obj;
};
