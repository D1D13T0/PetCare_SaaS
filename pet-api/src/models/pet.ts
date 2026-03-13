import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface PetAttributes {
	id: string;
	name: string;
	species: string;
	breed?: string;
	birth_date?: Date;
	user_id: string;
	clinic_id: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface PetCreationAttributes extends Optional<PetAttributes, "id"> {}

class Pet
	extends Model<PetAttributes, PetCreationAttributes>
	implements PetAttributes
{
	public id!: string;
	public name!: string;
	public species!: string;
	public breed?: string;
	public birth_date?: Date;
	public user_id!: string;
	public clinic_id!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Pet.init(
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
		species: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		breed: {
			type: DataTypes.STRING,
		},
		birth_date: {
			type: DataTypes.DATE,
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		clinic_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "pets",
		timestamps: true,
	},
);

export default Pet;
