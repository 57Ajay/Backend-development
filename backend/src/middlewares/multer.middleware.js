import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")// cb is callback function
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // should  change the file name, not changing is not a good practice,
        // can cause problem if user uploads files with same name;
    }
});

const upload = multer({ storage: storage });