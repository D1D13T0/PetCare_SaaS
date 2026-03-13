import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ClinicAttributes {
	id: string;
	name: string;
	cnpj?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface ClinicCreationAttributes extends Optional<ClinicAttributes, "id"> {}

class Clinic
	extends Model<ClinicAttributes, ClinicCreationAttributes>
	implements ClinicAttributes
{
	public id!: string;
	public name!: string;
	public cnpj?: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Clinic.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cnpj: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		tableName: "clinics",
		timestamps: true,
	},
);

export default Clinic;
