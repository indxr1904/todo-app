const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/utils");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Missing Details" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hasedPassword,
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not exists, Please signup" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password not matched" });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      user,
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
