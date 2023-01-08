const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "yourName"],
  },
  email: {
    type: String,
    require: [true, "yourEmail"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please, provide valid Email!!!!"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    require: [true, "Please, provide your Password!!!"],
    minlength: 8,
    select: false, /// never show up password when output
  },
  passwordConfirm: {
    type: String,
    require: [true, "Please, confirm your password!!!"],
    validate: {
      validator: function (el) {
        /// it will be call when doc is created. And it just run when we save() create()
        return el === this.password;
      },
      message: "Password is not same!!",
    },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); /// check if user just change his email not password

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
