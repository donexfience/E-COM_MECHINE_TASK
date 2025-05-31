export const routeAccess: Record<
  string,
  {
    requiredRoles: string[];
  }
> = {
  "/": {
    requiredRoles: ["user", "admin"],
  },
  "/admin": {
    requiredRoles: ["admin"], 
  },
};