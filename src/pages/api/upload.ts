import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_BUCKET
const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS
const secretAccessKey = process.env.AWS_SECRET

// Multer configuration for local storage
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
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed.'));
    }
  },
});

// API handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Use multer to handle the file upload
    upload.single('eventImage')(req as any, {} as any, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }

      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      console.log('Uploaded file path:', file.path);

       // Read the file content from disk
       const fileContent = await fs.promises.readFile(file.path);

       // Create S3 client
       const s3Client = new S3Client({
         region: region,
         credentials: {
           accessKeyId: accessKeyId!,
           secretAccessKey: secretAccessKey!,
         },
       });
 
       // Set up S3 upload parameters
       const uploadParams = {
         Bucket: bucketName!,
         Key: file.filename, // You can customize the key (filename in S3) as needed
         Body: fileContent,
         ContentType: file.mimetype,
       };
 
       // Upload the file to S3
       try {
         const data = await s3Client.send(new PutObjectCommand(uploadParams));
         console.log('File uploaded successfully', data);

         const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${file.filename}`;
         console.log(s3Url);
        
        // Optionally delete the file from local storage
         await fs.promises.unlink(file.path);
 
         res.status(200).json({
           message: 'File uploaded successfully',
           s3Url: s3Url,
         });
       } catch (error) {
         console.error('Error uploading file to S3:', error);
         res.status(500).json({ error: 'Error uploading file to S3' });
       }
    });
  } else {
    res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }
};

// Disable Next.js body parser for multer
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
