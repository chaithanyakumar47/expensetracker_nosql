const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
require('dotenv').config();
apiKey.apiKey = process.env.CLIENT_API_KEY;
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcrypt');
const User = require('../models/User')
const passwordReset = require('../models/passwordreset');


const forgotpassword = async(req, res) => {
    const uuid =  uuidv4()
    try {
        
        console.log('Inside the Backend API USER ID >>>',req.user.id)
        // const details = await ForgotPassword.create({ id: uuid, isactive: true, userId: req.user.id})
        const reset = new passwordReset({
            uuid: uuid,
            isactive: true,
            userId: req.user._id
        })
        await reset.save()
        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
            email: 'kumarchaithanya.1@gmail.com'
        }
        const receivers = [
            {
                email: req.body.email
            },
        ]
        const data = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            Subject: 'Link to Reset your Password',
            textContent: `http://localhost:3000/password/resetpassword/${uuid}`
        })
        res.status(200).json({ success: true})

    } catch (err) {
        res.status(500).json(err)
    }
}

const resetpassword = async(req, res) => {
    try {
        const uuid = req.params.uuid;
        console.log('UUID >>>',uuid)
        const data = await passwordReset.findOne({uuid: uuid})
        console.log(data.isactive)
        
        if (data.isactive == true) {
            // res.sendFile(path.join(rootDir, 'views','Recovery.html'))
            console.log('WORKS')
            res.send(`<html><script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script><form action="/password/updatepassword/${uuid}"><label for="newpassword">Enter New Password</label><input type="password" name="newpassword" required></input><button>Reset Password</button></form></html>`)
            res.end()
            
        } else {
            res.send('<h1>Please generate a new Link<h1>')
            res.end()
        }
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
}

const updatepassword = async (req, res) => {
    try {
    
    const newPassword = req.query.newpassword;
    const id = req.params.id;
    bcrypt.hash(newPassword, 10, async(err, hash) => {
        console.log(err);
        const forgotPass = await passwordReset.findOne({uuid: id});
        // await forgotPass.updateOne({ isactive: false})
        forgotPass.isactive = false;
        await forgotPass.save()
        // await User.updateOne( { password: hash},{ where: { id: forgotPass.userId}} );
        await User.updateOne({ _id: forgotPass.userId }, { password: hash })
        
        res.status(201).json({success: true});
    })
    } catch (err) {
        res.status(500).json(err)
    }


}

module.exports = {
    forgotpassword,
    resetpassword,
    updatepassword
}