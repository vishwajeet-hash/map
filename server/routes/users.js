const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register

router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); //when we pass the password in req body it will take it and hash it using the salt

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save and send response
    const user = await newUser.save();
    res.status(200).json(user._id); //we dont want all properties so only returning user id or maybe username if u want
  } catch (err) {
    res.status(500).json(err);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      //we don't tell the user which one is wrong exactly although we can:)
      return res.status(400).json("Wrong username or password");
    }

    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if(!validPassword){
        //we don't tell the user which one is wrong exactly although we can:)
      return res.status(400).json("Wrong username or password");                              //if we don't return then multiple req was giving an error(as we can't change/modify after the req header has been sent once)  
    } 

    //send res
    return res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
