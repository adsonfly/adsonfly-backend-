const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
