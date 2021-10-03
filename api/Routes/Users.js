const router = require("express").Router();
const User = require("../Models/User");
const cryptojs = require("crypto-js");
const verify = require("./verifyToken");

//update
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = cryptojs.AES.encrypt(
        req.body.password,
        process.env.cryptojs_secret
      ).toString();
    }
    try {
      const updatedUser = await User.findOneAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can update only your account!");
  }
});
//delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("user has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can delete only your account!");
  }
});
//get
router.delete("/find/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { password, ...info } = user._doc;

    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all
router.delete("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit() : await User.find();

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allowed");
  }
});
//get user stats

module.exports = router;
