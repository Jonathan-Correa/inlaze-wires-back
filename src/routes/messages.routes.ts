import { Router } from 'express';
import {
  create,
  getMostRecentMessages,
  listMessages,
} from '../controllers/messages.controller';

class MessagesRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.route('/api/messages').post(create);
    this.router.route('/api/messages/list').post(listMessages);
    this.router.route('/api/messages/mostRecent').get(getMostRecentMessages);
  }

  public getRouter() {
    return this.router;
  }
}

export const router = new MessagesRouter().getRouter();
