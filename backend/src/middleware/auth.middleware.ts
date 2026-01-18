import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid or missing token',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};