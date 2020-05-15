const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});
// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('image')
    ? cb(null, true)
    : cb(new Error('Not an image', false));
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

uploadUserPhoto = upload.single('img');

// const resizeImage = (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   sharp(req.file.buffer)
//     .resize(500, 300)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile();

//   next();
// };

module.exports = { uploadUserPhoto };
