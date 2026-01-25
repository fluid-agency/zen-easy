import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export interface MulterFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadFileToS3 = async (
  file: MulterFile,
  folder: string
): Promise<string> => {
  const ext = path.extname(file.originalname);
  const key = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}${ext}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    },
  });

  const result = await upload.done();
  return result.Location as string;
};

const uploadFilesToS3 = async (
  files: MulterFile[],
  folder: string
): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadFileToS3(file, folder);
    urls.push(url);
  }
  return urls;
};

export const ImageService = {
  uploadFileToS3,
  uploadFilesToS3,
};
