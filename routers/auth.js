const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

//register new account or signup

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res
            .status(404)
            .json({ error: true, user: null, errorMessage: "emailError" });
        if (user) {
            const validate = await bcrypt.compare(req.body.password, user.password);
            !validate
                ? res
                    .status(404)
                    .json({ error: true, errorMessage: "passwordError", user: null })
                : res
                    .status(200)
                    .json({ error: false, errorMessage: null, user: user });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashedPassword });
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        return res.status(404).json(err);
    }
    //or
    // const user=new User(req.body);
    // user.save().then((data)=>res.status(201).send(data)).then((err)=>res.status(400).send(err))
});

module.exports = router;
