import { Router } from 'express';
import {
  create,
  getMostRecentMessages,
  listMessages,
} from '../controllers/messages.controller';
import { allowAccess } from '../helpers/routes-helper';

class MessagesRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.route('/api/messages').all(allowAccess).post(create);
    this.router.route('/api/messages/list').all(allowAccess).post(listMessages);
    this.router.route('/api/messages/mostRecent').all(allowAccess).get(getMostRecentMessages);
  }

  public getRouter() {
    return this.router;
  }
}

export const router = new MessagesRouter().getRouter();
