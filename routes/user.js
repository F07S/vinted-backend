const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;

    // IF THE FIELDS ARE NOT FILLED IN *************************\\
    if (!username || !email || !password || typeof newsletter !== "boolean") {
      return res.status(400).json({ message: "Missing parameter" });
    }

    const emailAlreadyExists = await User.findOne({ email });

    // IF THE E-MAIL ENTERED ALREADY EXISTS******************\\
    if (emailAlreadyExists) {
      return res.status(409).json({ message: "This e-mail already exists" });
    }

    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email,
      account: {
        username,
      },
      newsletter,
      token,
      hash,
      salt,
    });

    await newUser.save();

    const clientRes = {
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    };

    res.json(clientRes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const newHash = SHA256(user.salt + password).toString(encBase64);

    if (newHash === user.hash) {
      res.json({
        message: "Log in successfull, welcome.",
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      res.status(400).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
