import { Request, Response, NextFunction } from 'express';

export interface IController {
  [key: string]: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}