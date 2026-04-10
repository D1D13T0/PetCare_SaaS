import Appointment from "./appointments";
import Clinic from "./clinic";
import Owner from "./owner";
import Pet from "./pet";
import User from "./user";

// RELACIONAMENTOS
User.hasMany(Pet, {
	foreignKey: "user_id",
	as: "pets",
});

Pet.belongsTo(User, {
	foreignKey: "user_id",
	as: "owner",
});

Clinic.hasMany(User, { foreignKey: "clinic_id", as: "users" });
User.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });
Clinic.hasMany(Pet, { foreignKey: "clinic_id", as: "pets" });
Pet.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });

Clinic.hasMany(Appointment, { foreignKey: "clinic_id" });
Appointment.belongsTo(Clinic, { foreignKey: "clinic_id" });

Pet.hasMany(Appointment, { foreignKey: "pet_id" });
Appointment.belongsTo(Pet, { foreignKey: "pet_id" });

User.hasMany(Appointment, { foreignKey: "veterinarian_id" });
Appointment.belongsTo(User, { foreignKey: "veterinarian_id" });

Clinic.hasMany(Owner, { foreignKey: "clinic_id" });
Owner.belongsTo(Clinic, { foreignKey: "clinic_id" });

export { User, Pet, Clinic, Owner };
