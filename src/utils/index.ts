import * as multer from 'multer';
import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 尝试创建uploads文件夹，如果已存在则忽略
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

export { storage };
