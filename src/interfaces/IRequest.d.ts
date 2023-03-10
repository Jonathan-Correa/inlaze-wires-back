import { IUser } from '../models/User';
import * as core from 'express-serve-static-core';

export interface IRequest extends Request {
  user?: IUser;
}

interface Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query> extends core.Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}
