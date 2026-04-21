import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface VaccineAttributes {
	id: string;
	clinic_id: string;
	pet_id: string;
	name: string;
	application_date: Date;
	next_dose_date?: Date;
	notes?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface VaccineCreationAttributes extends Optional<VaccineAttributes, "id"> {}

class Vaccine
	extends Model<VaccineAttributes, VaccineCreationAttributes>
	implements VaccineAttributes
{
	public id!: string;
	public clinic_id!: string;
	public pet_id!: string;
	public name!: string;
	public application_date!: Date;
	public next_dose_date?: Date;
	public notes?: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Vaccine.init(
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
		pet_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		application_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		next_dose_date: {
			type: DataTypes.DATE,
		},
		notes: {
			type: DataTypes.TEXT,
		},
	},
	{
		sequelize,
		tableName: "vaccines",
		timestamps: true,
	},
);

export default Vaccine;
