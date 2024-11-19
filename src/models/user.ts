import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  userName: string; // Add this field
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true }, // Add this field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
