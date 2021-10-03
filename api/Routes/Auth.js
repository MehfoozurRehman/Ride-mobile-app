const router = require("express").Router();
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../Models/User");

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptojs.AES.encrypt(
      req.body.password,
      process.env.cryptojs_secret
    ).toString(),
    profilePic: req.body.profilePic,
    isAdmim: req.body.isAdmim,
    isDriver: req.body.isDriver,
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong email or password");

    const bytes = cryptojs.AES.decrypt(
      user.password,
      process.env.cryptojs_secret
    );
    const orignalPassword = bytes.toString(cryptojs.enc.Utf8);

    orignalPassword !== req.body.password &&
      res.status(401).json("Wrong password");

    const accessToken = jwt.sign(
      { id: user._id, isAdmim: user.isAdmim },
      process.env.cryptojs_secret,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
