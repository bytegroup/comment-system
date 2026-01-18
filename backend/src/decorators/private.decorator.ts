import 'reflect-metadata';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export function Private() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Store the original method
    const originalMethod = descriptor.value;

    // Replace the method with authentication wrapper
    descriptor.value = function (this: any, req: Request, res: Response, next: NextFunction) {
      const self = this; // Capture the context
      return passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
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
        return originalMethod.call(self, req, res, next); // Use captured context
      })(req, res, next);
    };

    return descriptor;
  };
}