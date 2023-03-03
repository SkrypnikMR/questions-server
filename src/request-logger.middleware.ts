import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import * as chalk from 'chalk';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    morgan.token('color-status', (req: Request, res: Response) => {
      const status = res.statusCode;
      let color: string;

      if (status >= 500) {
        color = 'red';
      } else if (status >= 400) {
        color = 'yellow';
      } else if (status >= 300) {
        color = 'cyan';
      } else {
        color = 'green';
      }

      return chalk[color].bold(status.toString());
    });

    morgan.token('color-method', (req: Request) => {
      const method = req.method;
      let color;

      if (method === 'GET') {
        color = 'green';
      } else if (method === 'POST') {
        color = 'yellow';
      } else if (method === 'PUT' || method === 'PATCH') {
        color = 'cyan';
      } else if (method === 'DELETE') {
        color = 'red';
      } else {
        color = 'blue';
      }

      return chalk[color].bold(method);
    });

    morgan.token('color-path', (req: Request) => {
      const path = req.url;
      let color: string;

      if (path.startsWith('/questions')) {
        color = 'magenta';
      } else if (path.startsWith('/')) {
        color = 'blue';
      } else {
        color = 'white';
      }

      return chalk[color].bold(path);
    });

    const loggerFormat = `[:color-status] :color-method :color-path - :response-time ms`;

    morgan(loggerFormat, {
      stream: {
        write: (message: string) => {
          console.log(message);
        },
      },
    })(req, res, next);
  }
}
