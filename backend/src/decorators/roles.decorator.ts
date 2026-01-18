import { Request, Response, NextFunction } from 'express';

export const ROLES_KEY = 'roles';

export function Roles(roles: string[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (this: any, req: Request, res: Response, next: NextFunction) {
            const self = this; // Add this
            // ... rest of the code
            return originalMethod.call(self, req, res, next); // Use self instead of this
        };

        return descriptor;
    };
}