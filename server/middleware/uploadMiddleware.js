import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,

    metadata(req, file, cb) {
      cb(null, {
        uploadedBy: req.user.id,
      });
    },

    key(req, file, cb) {
      const uniqueName =
        Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

      cb(null, uniqueName);
    },

    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),

  fileFilter(req, file, cb) {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Images are allowed."));
    }
  },
});

export default upload;
