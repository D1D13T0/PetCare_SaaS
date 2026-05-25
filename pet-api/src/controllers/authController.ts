import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { firebaseAdmin } from "../config/firebase";
import User from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const userExists = await User.findOne({ where: { email } });

		if (userExists) {
			return res.status(400).json({
				message: "Usuário já existe",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email,
			password: hashedPassword,
			role: "OWNER",
		});

		return res.status(201).json({
			id: user.id,
			email: user.email,
			role: user.role,
			message: "Usuário criado com sucesso",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao registrar usuário",
		});
	}
};

export const googleLogin = async (req: Request, res: Response) => {
	try {
		const { idToken } = req.body;

		if (!idToken) {
			return res.status(400).json({ message: "idToken é obrigatório" });
		}

		const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
		const email = decoded.email;

		if (!email) {
			return res.status(400).json({ message: "Email não encontrado no token" });
		}

		let user = await User.findOne({ where: { email } });

		if (!user) {
			const hashedPassword = await bcrypt.hash(decoded.uid, 10);
			user = await User.create({
				email,
				password: hashedPassword,
				role: "ADMIN",
			});
		}

		const token = jwt.sign(
			{ id: user.id, role: user.role, clinic_id: user.clinic_id },
			JWT_SECRET,
			{ expiresIn: "1d" },
		);

		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				clinic_id: user.clinic_id,
			},
		});
	} catch (error: any) {
		console.error("ERRO GOOGLE LOGIN:", error);
		return res.status(401).json({ message: "Token inválido" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({
				message: "Credenciais inválidas",
			});
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return res.status(400).json({
				message: "Credenciais inválidas",
			});
		}

		const token = jwt.sign(
			{
				id: user.id,
				role: user.role,
				clinic_id: user.clinic_id,
			},
			JWT_SECRET,
			{ expiresIn: "1d" },
		);

		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				clinic_id: user.clinic_id,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Erro ao fazer login",
		});
	}
};
