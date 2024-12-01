import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS;
const secretAccessKey = process.env.AWS_SECRET;

// Validate environment variables
if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing AWS configuration variables.');
}

// Configure multer with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
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
    upload.single('eventImage')(req as any, {} as any, async (err) => {
      try {
        if (err) {
          throw new Error(`Upload error: ${(err as Error).message}`);
        }

        const file = (req as any).file;

        if (!file) {
          throw new Error('No file uploaded.');
        }

        // S3 key structure
        const date = new Date().toISOString().split('T')[0];
        const key = `uploads/${date}/${randomUUID()}-${file.originalname}`;

        // S3 client
        const s3Client = new S3Client({
          region,
          credentials: {
            accessKeyId: accessKeyId!,
            secretAccessKey: secretAccessKey!,
          },
        });

        // S3 upload parameters
        const uploadParams = {
          Bucket: bucketName!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        // Upload to S3
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('File uploaded successfully', data);

        const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        res.status(200).json({ message: 'File uploaded successfully', s3Url });
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: 'An unknown error occurred.' });
        }
      }
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
