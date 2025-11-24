const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'profilePic') {
      uploadPath += req.user.role === 'student' ? 'students/' : 'staff/';
    } else if (file.fieldname === 'questionPaper') {
      uploadPath += 'questionpapers/';
    } else if (file.fieldname === 'material') {
      uploadPath += 'materials/';
    } else if (file.fieldname.startsWith('questionImage')) {
      uploadPath += 'questionpapers/images/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    profilePic: /jpeg|jpg|png/,
    questionPaper: /pdf|doc|docx/,
    material: /pdf|doc|docx|ppt|pptx|mp4|avi/
  };
  
  let fileType;
  if (file.fieldname.startsWith('questionImage')) {
    fileType = /jpeg|jpg|png|gif/;
  } else {
    fileType = allowedTypes[file.fieldname] || /jpeg|jpg|png|pdf|doc|docx/;
  }
  
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: process.env.MAX_FILE_SIZE || 10485760 }, // 10MB
  fileFilter
});

module.exports = upload;