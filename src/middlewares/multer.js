const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads/driver-documents");
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// file filter (only images)
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files allowed"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter,
});

module.exports = upload;
