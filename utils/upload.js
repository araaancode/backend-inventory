const multer = require("multer");
const mkdirp = require("mkdirp");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

const storage = multer.memoryStorage();

// user
const houseCoverImagesDir = path.join(
  __dirname,
  "../uploads/houseCoverImages/"
);
const userAvatarDir = path.join(__dirname, "../uploads/userAvatarDir/");
// admin
const adminAvatarDir = path.join(__dirname, "../uploads/adminAvatarDir/");
// driver
const driverAvatarDir = path.join(__dirname, "../uploads/driverAvatarDir/");
const driverAdsPhotosDir = path.join(
  __dirname,
  "../uploads/driverAdsPhotosDir/"
);
const driverBusPhotosDir = path.join(
  __dirname,
  "../uploads/driverBusPhotosDir/"
);
const driverSupportTicktsDir = path.join(
  __dirname,
  "../uploads/driverSupportTicktsDir/"
);
// owner
const ownerAvatarDir = path.join(__dirname, "../uploads/ownerAvatars/");
const ownerAdsDir = path.join(__dirname, "../uploads/ownerAdsDir/");
const ownerSupportTicktsDir = path.join(
  __dirname,
  "../uploads/ownerSupportTicktsDir/"
);
const ownerCoverDir = path.join(__dirname, "../uploads/ownerCoverDir/");

// cook
const cookAvatarDir = path.join(__dirname, "../uploads/cookAvatarDir/");
const cookAdsDir = path.join(__dirname, "../uploads/cookAdsDir/");
const cookSupportTicktsDir = path.join(
  __dirname,
  "../uploads/cookSupportTicktsDir/"
);
const foodPhotosDir = path.join(__dirname, "../uploads/foodPhotosDir/");

// ########################## Liara ##########################
const s3Client = new S3Client({
  region: "default", // لیارا نیازی به region ندارد
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

// تنظیمات Multer برای آپلود فایل
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // حداکثر 5MB
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error('فقط فایل‌های JPG و PNG مجاز هستند!'));
//   },
// });

module.exports = {
  // ******************** owenr ********************
  // owner avatar
  ownerAvatarUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(ownerAvatarDir);
        cb(null, ownerAvatarDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // owner ads
  ownerAdsPhotosUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(ownerAdsDir);
        cb(null, ownerAdsDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // owner support tickets
  ownerSupportTicketUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(ownerSupportTicktsDir);
        cb(null, ownerSupportTicktsDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // ******************** house cover ********************
  houseUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(ownerCoverDir);
        cb(null, ownerCoverDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // ******************** user avatar ********************
  userUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(userAvatarDir);
        cb(null, userAvatarDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // ******************** admin avatar ********************
  adminUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(adminAvatarDir);
        console.log(made);
        cb(null, adminAvatarDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // ******************** driver ********************
  // driver avatar
  driverUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(driverAvatarDir);
        cb(null, driverAvatarDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // driver ads photo and photos
  driverAdsPhotosUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(driverAdsPhotosDir);
        cb(null, driverAdsPhotosDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // ******************** driver bus photo and photos ********************
  driverBusPhotosUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(driverBusPhotosDir);
        cb(null, driverBusPhotosDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // driverBusPhotosUpload: multer({
  //   storage: multerS3({
  //     s3: s3Client,
  //     bucket: "kome", // نام باکت
  //     acl: "public-read", // دسترسی عمومی
  //     contentType: multerS3.AUTO_CONTENT_TYPE,
  //     key: function (req, file, cb) {
  //       cb(null, `images/${Date.now()}-${file.originalname}`);
  //     },
  //   }),

  // }),

  // driver support ticket image
  driverSupportTicketUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(driverSupportTicktsDir);
        cb(null, driverSupportTicktsDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // ******************** cook ********************
  cookAvatarUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(cookAvatarDir);
        cb(null, cookAvatarDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // cook ads
  upload: multer({ storage }),

  // cook support ticket image
  cookSupportTicketUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(cookSupportTicktsDir);
        cb(null, cookSupportTicktsDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // foods uploads
  foodPhotoUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(foodPhotosDir);
        cb(null, foodPhotosDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  foodPhotosUpload: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const made = mkdirp.sync(foodPhotosDir);
        cb(null, foodPhotosDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
  }),

  // foodPhotoUpload: multer({ storage }),
  // foodPhotosUpload: multer({ storage }),
};
