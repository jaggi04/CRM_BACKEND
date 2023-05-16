const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


const Joi = require("joi");

const registerSchema = Joi.object({
  fname: Joi.string().min(3).required(),
  lname: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});



const adminVerify = require("../adminauth/adminverfiy");


router.post("/register", adminVerify, async (req, res) => {
  //CHECKING IF USER EMAIL ALREADY EXISTS
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) res.status(400).send("Email already exists");

 

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
    type: "manager",
  });

  try {
   
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
     

      const saveUser = await user.save();
      //   res.send({ user: user._id });
      res.send("user created");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});



router.post("/login", async (req, res) => {
  

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Incorrect Email- ID");

  

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Incorrect Password");

  try {
    

    const { error } = await loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      console.log(user.type);
      if (user.type === "manager") {
        const token = jwt.sign(
          { _id: user._id },
          process.env.MANAGER_TOKEN_SECRET
        );
        res.status(200).header("auth-token", token).send(token);
      } else {
        res.status(200).json({ message: "seems like you are not a manager" });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
