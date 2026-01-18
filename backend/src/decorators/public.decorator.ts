import 'reflect-metadata';

export const IS_PUBLIC_KEY = 'isPublic';

export function Public() {
  return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    // Mark the route as public
    Reflect.defineMetadata(IS_PUBLIC_KEY, true, descriptor.value);
    return descriptor;
  };
}

// Helper to check if route is public
export function isPublicRoute(handler: Function): boolean {
  return Reflect.getMetadata(IS_PUBLIC_KEY, handler) === true;
}