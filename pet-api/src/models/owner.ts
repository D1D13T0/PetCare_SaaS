import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface OwnerAttributes {
	id: string;
	clinic_id: string;
	name: string;
	email?: string;
	phone?: string;
	document?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface OwnerCreationAttributes extends Optional<OwnerAttributes, "id"> {}

class Owner
	extends Model<OwnerAttributes, OwnerCreationAttributes>
	implements OwnerAttributes
{
	public id!: string;
	public clinic_id!: string;
	public name!: string;
	public email?: string;
	public phone?: string;
	public document?: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Owner.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		clinic_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
		},
		phone: {
			type: DataTypes.STRING,
		},
		document: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		tableName: "owners",
		timestamps: true,
	},
);

export default Owner;
