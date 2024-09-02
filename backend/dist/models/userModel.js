"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
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
            validator: function (el) {
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
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this function if password was actually modified
        if (!this.isModified("password"))
            return next();
        // Hash the password with cost of 12
        this.password = yield bcrypt_1.default.hash(this.password, 12);
        // Delete passwordConfirm field
        this.passwordConfirm = undefined;
        next();
    });
});
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew)
        return next();
    this.passwordChangedAt = new Date(Date.now() - 1000); // Assigning a Date object
    next();
});
// Method to check if password is correct
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
// Method to check if user changed password after JWT issue time
userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
    if (this.passwordChangedAt) {
        const changeTimestamp = this.passwordChangedAt.getTime() / 1000;
        return JWTtimestamp < changeTimestamp;
    }
    return false;
};
exports.User = mongoose_1.default.model("Users", userSchema);
