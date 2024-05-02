const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function generateAccessToken(id, name, premiumRequest) {
    if (!premiumRequest){
        return jwt.sign({ userId: id, name: name }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')
    } else {
        return jwt.sign({ userId: id, name: name, premiumUser: true }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')
    }
    
    
}

const signup = async (req, res, next) => {
    try{
        
        const { username, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword})
        const data = await user.save()
        res.status(201).json(data);
        // bcrypt.hash(password, 10, async(err, hash) => {
        //     console.log(err);
        //     const user = new User( { username: username, email: email, password: hash, isPremium: false, totalExpenses: 0 });
        //     const data = await user.save();
        //     res.status(201).json(data);
        // })

        
        
    } catch(err) {
        res.status(403).json({ err: 'email is already in use'});
    }
}

const login = async (req, res, next) => {
    try{
        const { email, password} = req.body;
        const user = await User.findOne({ email: email});

        if (!user) {
            return res.status(404).json({ status: false, message: 'User does not exist'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({status: false, message: 'Password is incorrect'})
        }

        const token = generateAccessToken(user._id, user.username, false);
        res.status(200).json({ status: true, message: 'Logged in Successfully', token})
        // const emailCheck = await User.findAll({ where : {email: email}});
        // if (emailCheck.length > 0){
        //     bcrypt.compare(password, emailCheck[0].password, (err, result) => {
        //         if(err) {
        //             throw new Error('Something went wrong')
        //         }
        //         if(result === true) {
        //             res.status(200).json({ status: true, message: 'Logged in Successfully', token: generateAccessToken(emailCheck[0].id, emailCheck[0].username, false)});
        //         }
        //         else {
        //             return res.status(400).json({ status: false, message: 'Password is incorrect'})
        //         }
        //     })
        // }else {
        //     res.status(404).json({ status: false, message: 'User does not exist'})
        // }
        
    } 
    catch(err) {
        res.status(404).json({err: err});
    }    
}

module.exports = {
    signup,
    login,
    generateAccessToken
}