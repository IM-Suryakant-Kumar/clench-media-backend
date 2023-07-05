const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide name"],
		minlength: [3, "Name should be greater than or equal 3 characters"],
		maxlength: [50, "Name should be less than and equal to 50 chracter"]
	},
	email: {
		type: String,
		required: [true, "Please rovide email"],
		unique: true,
		validate: [validator.isEmail, "Please provide valid email"]
	},
	avatar: {
		public_id: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	password: {
		type: String,
		required: [true, "Please Provide password"],
		minlength: [6, "Password should be greater than or equal 6 characters"],
		maxlength: [12, "Password should be less than or equal 50 characters"],
        select: false
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user"
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME
	});
};

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
