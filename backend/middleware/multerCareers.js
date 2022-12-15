const exppres = require("express");
const router = exppres.Router();
const path = require("path");
const multer = require("multer");

const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadsCareers')
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})



function checkFileType(fields, file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf|svg|webp|msword|docx|doc/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error!');
    }
  }


  exports.upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
      checkFileType(req.body, file, cb);
    }
  }); 


  exports.uploadImage = (req, res) => {
    upload(req, res, function (error) {
      if(!req.file){
        return res.send('Please select file to upload');
      }
      else if (error) {
        return res.status(500).json({ error: error });
      }
      return res.status(200).json({msg: "File uploaded successfully."})
    });
};