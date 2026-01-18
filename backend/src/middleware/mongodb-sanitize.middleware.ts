import { Request, Response, NextFunction } from "express";

interface SanitizeOptions {
    replaceWith?: string; // default "_"
}

function sanitizeObject(obj: any, options: SanitizeOptions = {}): any {
    const replaceWith = options.replaceWith ?? "_";

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = sanitizeObject(obj[i], options);
        }
        return obj;
    } else if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj)) {
            const sanitizedKey = key.replace(/\$/g, replaceWith).replace(/\./g, replaceWith);
            if (sanitizedKey !== key) {
                obj[sanitizedKey] = obj[key];
                delete obj[key];
            }
            obj[sanitizedKey] = sanitizeObject(obj[sanitizedKey], options);
        }
        return obj;
    }
    return obj;
}

export function mongoSanitizeMiddleware(options?: SanitizeOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        // mutate in place, do NOT overwrite req.query / req.params / req.body
        if (req.body) sanitizeObject(req.body, options);
        if (req.query) sanitizeObject(req.query, options);
        if (req.params) sanitizeObject(req.params, options);

        next();
    };
}
