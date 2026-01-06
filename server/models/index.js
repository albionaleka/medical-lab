import { User } from "./User.js";
import { Profile } from "./Profile.js";

User.hasOne(Profile, { foreignKey: "userId", as: "profile" });
Profile.belongsTo(User, { foreignKey: "userId", as: "user" });
