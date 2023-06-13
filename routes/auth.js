const express = require('express');
const router = express.Router();
const User = require('../databases/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUser = require('../middleware/getUser');
const JWT_SECRET = 'ok'

// ROUTE:1 // create user using POST localhost:5000/api/auth/createuser
router.post('/createuser', [
    body('email', 'enter a valid email').isEmail(),
    body('name', 'enter a valid name with only letters').isLength({ min: 3 }),
    body('password', 'Password should be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // if there are errors, return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success,error:  errors.array()[0].msg });
    }
    // Check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success,error: "Sorry a candidate with this email already exists" })
        }
        // create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    }

    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})
// ROUTE: 2 authenticate a user using POST "/api/auth/login".No login required
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // if there are errors, return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success,error:  errors.array()[0].msg });
    }

    // destructuring remove email and password from body to authenticate login
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({error: 'Invalid Login Credentials' })
        }
        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) {
            return res.status(400).json({error: 'Invalid Login Credentials' })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }

})
// ROUTE:3 // get logged in user details  using POST localhost:5000/api/auth/getuser Login Required
router.post('/getuser', getUser, async (req, res) => {
    // if there are errors, return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }

})


module.exports = router;