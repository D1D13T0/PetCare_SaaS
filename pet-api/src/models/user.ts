import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface UserAttributes {
	id: string;
	email: string;
	password: string;
	role: "ADMIN" | "OWNER";
	clinic_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface UserCreationAttributes
	extends Optional<UserAttributes, "id" | "role" | "clinic_id"> {}

class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	public id!: string;
	public email!: string;
	public password!: string;
	public role!: "ADMIN" | "OWNER";
	public clinic_id?: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		role: {
			type: DataTypes.ENUM("ADMIN", "OWNER"),
			defaultValue: "ADMIN",
		},
		clinic_id: {
			type: DataTypes.UUID,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "users",
		timestamps: true,
	},
);

export default User;
