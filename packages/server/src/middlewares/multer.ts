const path = require('path');
const multer = require('src/middlewares/multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.csv') {
            cb(new Error('File type is not supported'), false);
            return;
        }
        cb(null, true);
    },
});