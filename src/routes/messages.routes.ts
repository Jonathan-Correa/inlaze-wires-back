import { Router } from 'express';
import { create } from '../controllers/messages.controller';

class MessagesRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post('/api/messages', create);
  }

  public getRouter() {
    return this.router;
  }
}

export const router = new MessagesRouter().getRouter();
