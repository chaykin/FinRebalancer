import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

export abstract class AbstractRoutes {
  public express: express.Application;

  protected constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  protected middleware(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  protected abstract routes(): void;
}