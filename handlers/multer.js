const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})
const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'application/pdf'){
        cb(null,true);
    }
    else{
        alert("unsupported file format");
        cb({message:'unsupported file format'}, false);
    }
}
const upload = multer({
    storage : storage,
    limits:{fileSize: 10*1024*1024},
    fileFilter: fileFilter
})

module.exports = upload;
