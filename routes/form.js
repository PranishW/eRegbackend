const express = require('express');
const router = express.Router();
const getUser = require('../middleware/getUser');
const upload = require('../middleware/multer')
const { body, validationResult } = require('express-validator');
const Form = require('../databases/Form');
// ROUTE:1 fetch Form information using GET localhost:6000/api/form/forminfo Login required
router.get('/forminfo', getUser, async (req, res) => {
    let success = true;
    try {
        const form = await Form.find({user:req.user.id})
        if(form[0])
        {
            res.json(form[0]);
        }
        else
        {
            res.json({success,error:"Student has not filled the form"})
        }
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})
// ROUTE:2 Fill the form using POST localhost:6000/api/form/fillform Login required
router.post('/fillform', [getUser,upload.single('profile')], [
    body('name', 'Name must be atleast 3 letters long').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('age', 'Age must be above 15 and below 22').isNumeric(),
    body('dob','Date of Birth is required'),
    body('address','Address should contain atleast 10 characters').isLength({min:10}),
    body('gender','Select Gender').isLength({min:4}),
    body('mobno','Phone no must be valid').isMobilePhone()
], async (req, res) => {
    let success = false;
    try {
        // if there are errors, return bad requests and the errors
        let existform = await Form.findOne({user: req.user.id})
        if(existform)
        {
            return res.status(400).json({ success, error: "Sorry you have already filled the form" })
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, error: errors.array()[0].msg });
        }
        let mail = await Form.findOne({email: req.body.email})
        if (mail) {
            return res.status(400).json({ success, error: "Sorry a user with this email or mobile no already filled the form" })
        }
        let mob = await Form.findOne({ mobno: req.body.mobno });
        if (mob) {
            return res.status(400).json({ success, error: "Sorry a user with this email or mobile no already filled the form" })
        }
        if(!req.file)
        {
            return res.status(400).json({ success, error: "Upload Candidate Image" })
        }
        // destructuring
        const { name,email,age,dob,address,gender,mobno } = req.body
        const profile = req.file.filename
        const form = new Form({
            name,email,age,dob,address,gender,mobno,profile, user: req.user.id
        })
        const savedForm = await form.save()
        success = true;
        res.status(200).json({success,savedForm});
    } catch (error) {
        success = false;
        console.error(error.message)
        res.status(500).json({success,error:"Internal Server Error"}); // sending to user 
    }

})
module.exports = router;
