const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signUpUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hash=>{
            const user = new User({
            email:email,
            password:hash
         }).save()
            .then(usr=>{
                res.status(200).json({
                    message: "USER CREATED SUCCESSFULLY!"
                 })
             })
            .catch(err=>{
                res.status(500)
                 next(err);
            })
        })
        .catch(err=>{
            res.status(500)
            next(err);
        });
}
exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;


    User.findOne({email:email})
        .then(user=>{
            if(user!==null){
                bcrypt.compare(password, user.password)
                .then(isAuth=>{
                    if(isAuth===true){
                        const id = user._id;
                        const email = user.email;
                        const token = jwt.sign({id: id, email: email}, process.env.JWT_KEY, { expiresIn: '1h' });
                        
                        res.status(200).json({
                            message: "USER LOGGED IN!",
                            token: token,
                            userId: user._id
                        })
                    }
                    else{
                        res.status(401).json({
                            message:"YOU ARE UNAUTHORIZED!"
                        })
                    }
                })
                .catch(err=>{
                    res.status(500);
                    next(err);
                })
            }
            else{
                res.status(401).json({
                    message:"YOU ARE UNAUTHORIZED!"
                })
            }
            
        })
        .catch(err=>{
            res.status(500);
            next(err);
        })

}

exports.emailUnique =  (req, res, next) => {
    const email = req.params.email
    User.findOne({email:email})
        .then(user=>{
            if(user){
                res.status(200).json({
                    isUnique:false
                })
            }
            else{
                res.status(200).json({
                    isUnique:true
                })
                console.log(true);
            }
        })
        .catch(err=>{
            res.status()
            next(err);
        })
}

