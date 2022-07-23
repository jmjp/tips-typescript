import { NextFunction, Request, Response } from "express";

function ensureRoutePermission(permissions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.loggedUser;
        if (!user) {
            return res.status(400).json({ status: "error", message: "Please, login first" });
        }
        const userPermissions = user.role;
        const hasPermission = permissions.some(permission => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(401).json({ status: "error", message: "You can't access this route" });
        }
        return next();
    }
}

export { ensureRoutePermission }