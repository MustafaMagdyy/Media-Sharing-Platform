import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role:string;
  passwordConfirm: string | undefined;
  correctPassword: Function;
  changedPasswordAfter: Function;
  passwordChangedAt?: Date;
}
const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ['user','admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "A user must have a password."],
    minlength: 6,
    select: false, // Excluding password field from query results
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: "passwords are not the same",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to encrypt password before saving
userSchema.pre<IUser>("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000); // Assigning a Date object
  next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if user changed password after JWT issue time
userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTtimestamp < changeTimestamp;
  }
  return false;
};

export const User = mongoose.model<IUser>("Users", userSchema);
