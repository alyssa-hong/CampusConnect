import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { error } from 'console';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Accept only jpeg and png file types
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed.'));
    }
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    upload.single('eventImage')(req as any, {} as any, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: `Upload error: ${err.message}`  });
      }

      if (!(req as any).file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      res.status(200).json({
        filePath: `/uploads/${(req as any).file.filename}`,
        message: 'File uploaded successfully',
      });
    });
  } else {
    res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
