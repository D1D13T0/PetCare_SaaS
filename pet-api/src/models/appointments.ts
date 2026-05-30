import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface AppointmentAttributes {
	id: string;
	clinic_id: string;
	pet_id: string;
	veterinarian_id: string;
	date: Date;
	status: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
	diagnosis?: string;
	notes?: string;
	valor?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

interface AppointmentCreationAttributes
	extends Optional<AppointmentAttributes, "id" | "status"> {}

class Appointment
	extends Model<AppointmentAttributes, AppointmentCreationAttributes>
	implements AppointmentAttributes
{
	public id!: string;
	public clinic_id!: string;
	public pet_id!: string;
	public veterinarian_id!: string;
	public date!: Date;
	public status!: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
	public diagnosis?: string;
	public notes?: string;
	public valor?: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Appointment.init(
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
		veterinarian_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("SCHEDULED", "CONFIRMED", "CANCELLED", "COMPLETED"),
			defaultValue: "SCHEDULED",
		},
		diagnosis: {
			type: DataTypes.TEXT,
		},
		notes: {
			type: DataTypes.TEXT,
		},
		valor: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "appointments",
		timestamps: true,
	},
);

export default Appointment;
