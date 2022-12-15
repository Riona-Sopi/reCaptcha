const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const validation = require("../validators/auth.validation");
const expressJwt = require("express-jwt");
const authService = require('../services/auth/auth.services');
const _ = require('lodash');
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const shortId = require('shortid');


const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/pdf')
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).fields([{name: "cv"}, {name: "image"}]);


// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /pdf|doc|docs|word/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb({upload: 'Error: PDf file only and docs!'});
    }
  }



exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

exports.signup = async (req, res) => {
    let newUser;

    try {
        const { error } = validation.userSignupValidation(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });
        
        const doesEmailExist = await User.findOne({ email: req.body.email });
        
        if (doesEmailExist)
            return res.status(400).json({ error: "Email already exists" });
      
      const user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ error: "User with that email exists. Please siginin." });
   
      newUser = authService.signup(req.body);

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }
  
    if (newUser) {
      res.status(200).json({ success: true, newUser, message:"New User added successfully! Sign in, or add another user below." });
    } else {
      res.status(500).json({ success: false });
    }
};

exports.signin = async (req, res) => { 

  // const captchaToken = req.body.captchaToken;

  // const googleVerifyUrl=`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.YOUR_PRIVATE_KEY}&response=${captchaToken}`
  // const response = await axios.post(googleVerifyUrl);
  // const {success} = response.data;
  // if(success){
  //   return res.json({ success: true });
  // }else {
  //   return res
  //   .status(400)
  //   .json({ error: "Invalid Captcha. Try again." });
  // }

    // if(res.data.success)
    // console.log('Human');
    // else
    //   console.log('BOT!!!');

    const { email, password } = req.body;
      // validate the user
      const { error } = validation.userSigninValidation(req.body);

      // throw validation errors
      if (error) return res.status(400).json({ error: error.details[0].message });

      const user = await User.findOne({ email: req.body.email });

      // throw error when email is wrong
      if (!user) return res.status(400).json({ error: "Email is wrong" });

    try {
       
         // check if user exist
        User.findOne({ email }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User with that email does not exist. Please signup.'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    error: 'Email and password do not match.'
                });
            }
            // generate a token and send to client
            const token = jwt.sign({ _id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1d' });
             
            const { _id, username, name, email, role } = user;
            res.cookie('token', token, { expiresIn: '1d'});
            // const { _id, username, name, email, role } = user;
            return res.json({
                token,
                user: { _id, username, name, email, role }
            });
          
        });
    } catch (error) {
        res.status(400).json(error);
    }

};



exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    _id: this._id, 
    role: this.role  
    // userProperty: "auth",
  });


  exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

// exports.update = async (req, res) => { 
//     try { 
//         const { error } = validation.editValidation(req.body);

//         if (error) return res.status(400).json({ error: error.details[0].message });

//         const update = {};

//         if(req.body.name) update.name = req.body.name;
//         if(req.body.surname) update.surname = req.body.surname;
//         if(req.body.email)  update.email = req.body.email;
//         if(req.body.role) update.role = req.body.role;
//         if(req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             const hashPassword = await bcrypt.hash(req.body.password, salt)
//             update.password = hashPassword;
//         }
    
//         User.findOneAndUpdate({_id: req.body.id}, update, {
//             new: true
//         }).then(user => res.json(user))
//         .catch(err => res.status(404).json(err));
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//         return;
//     }
// };

exports.getUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
  
      if (!user) return res.status(400).json({ error: "User does not exist." });
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  exports.list = async (req, res) => {
    try {
        const user = await User.find({})
       
        .select('_id name email role postedBy createdAt updatedAt')
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            });
        }

        req.profile = user;
        next();
    });
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email});
        if (!user) return res.status(500).json({error: "User does not exist"});
    
        const token = jwt.sign(
            {
                email: email
            },
            process.env.JWT_RESET_PASSWORD,
            {
                expiresIn: 7200 //expires in 2h
            }
        );
        const link = process.env.CLIENT_URL + "/auth/password/reset/" + token
        await user.updateOne({ resetPasswordLink: token });
        await sendMail(email, link, user.name);
        res.status(200).json({message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 2 hours.` });


    } catch (error) {
        res.send(error);
    }

}


exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Try again'
                });
            }
            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try later'
                    });
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            });
        });
    }
};



async function sendMail(email, link, name) {

    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'rs50936@ubt-uni.net',
        pass: 'rionA12345lorenA!'
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  
    var mailOptions = {
      from: '"Albi Mall "rs50936@ubt-uni.net', 
      to: email, 
      subject: 'Albi Mall', 
      text: 'Përshëndetje!', 
      html: `
      <table width="800px"
          style="margin: auto;padding: 85px 65px;">
        <tr>
            <td style="padding-bottom: 40px;">
                <p style="font-size: 17px; line-height: 1.5;">Përshëndetje ${name},
                    <br/><br/>
                    Kliko në vegëzën e mëposhtme që ta ndryshosh fjalëkalimin për qasje në CMS të Albi Mall<br>
                </p>
            </td>
        </tr>
        <tr>
        </tr>
        <tr>
            <td style="padding-bottom: 40px;">
                <p style="padding: 20px 0; text-decoration: none;font-size: 17px; line-height: 1.5;">
                    <a href=${link} style="padding: 20px 40px; text-decoration: none;color: white;background-color: #303030"><b>NDRYSHO FJALËKALIMIN</b></a>
                </p>
            </td>
        </tr>
      </table>` 
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent');
    });
}


exports.contactFormSendEmail = async (req, res, next) => {
    const { name, email, description } = req.body;

    await emailContactForm(name, email, description);

    res.status(200).json({ message: 'Ankesa është dërguar me sukses. Ne do të ju përgjigjemi sa më parë!' })
}

async function emailContactForm(name, email, description) {
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'rs50936@ubt-uni.net',
        pass: 'rionA12345lorenA!'
      },

      tls: {
        rejectUnauthorized: false
      }
    });
  
    var mailOptions = {
      from: '"Ankesë nga Albi Mall Web"',
      to: 'rs50936@ubt-uni.net', 
      subject: 'Ankesë nga Albi Mall Web', 
      text: '', 
      html: `
        Përshëndetje nga ${name}, <br/> Email addresa: ${email} <br /><br/>
        ${description}
      ` 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent');
    });
}


exports.careerFormSendEmail = async (req, res, next) => {

  const image = req.files.image[0];
  const cv = req.files.cv[0];
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'rs50936@ubt-uni.net',
        pass: 'rionA12345lorenA!'
      },

      tls: {
        rejectUnauthorized: false
      }
    });
  
    var mailOptions = {
      from: '"Konkurs nga Albi Mall Web"',
      to: 'rs50936@ubt-uni.net', 
      subject: 'Konkurs nga Albi Mall Web', 
      text: '', 
      html: `
        Aplikacion pune për pozicionin: ${req.body.position} <br/> 
        Emri: ${req.body.name} <br/> 
        Mbiemri: ${req.body.lastName} <br/>
        Data e Lindjes: ${req.body.birthday} <br/>
        Pozita: ${req.body.position} <br/>
        Email Adresa: ${req.body.email} <br/>
        Numri i telefonit: ${req.body.phone} <br/>
      `,
      attachments: [
            {
                filename: image.filename,
                path: image.path
            },
            {
                filename: cv.filename,
                path: cv.path
            }
        ] 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent');
    });

    res.status(200).json({ message: 'Aplikacioni për punë është dërguar me sukses. Ne do të ju përgjigjemi sa më parë!' })
}

async function careerForm(name, lastName, birthday, position, email, phone, cv, image) {
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'rs50936@ubt-uni.net',
        pass: 'rionA12345lorenA!'
      },

      tls: {
        rejectUnauthorized: false
      }
    });
  
    var mailOptions = {
      from: '"Ankesë nga Albi Mall Web"',
      to: 'rs50936@ubt-uni.net', 
      subject: 'Ankesë nga Albi Mall Web', 
      text: '', 
      html: `
        Aplikacion pune per pozicionin: ${position} <br/> 
        Emri: ${name} <br/> 
        Mbiemri: ${lastName} <br/>
        Data e Lindjes: ${birthday} <br/>
        Pozita: ${position} <br/>
        Email Adresa: ${email} <br/>
        Numri i telefonit: ${phone} <br/>
      `,
      attachments: [
            {
                filename: cv.filename,
                path: cv.path,
            },
            {
                filename: image.filename,
                path: image.path,
            }
        ] 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent');
    });
}
