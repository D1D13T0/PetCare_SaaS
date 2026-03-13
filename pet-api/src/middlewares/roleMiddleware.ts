import { NextFunction, Request, Response } from "express";

export const requireRole = (role: "ADMIN" | "OWNER") => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}

		if (req.user.role !== role) {
			return res.status(403).json({ message: "Acesso negado" });
		}

		next();
	};
};
