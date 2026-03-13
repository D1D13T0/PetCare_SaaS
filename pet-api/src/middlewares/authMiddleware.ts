import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({
			message: "Token não fornecido",
		});
	}

	const [, token] = authHeader.split(" ");

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as any;

		const user = await User.findByPk(decoded.id);

		if (!user) {
			return res.status(401).json({
				message: "Usuário não encontrado",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Token inválido",
		});
	}
};
