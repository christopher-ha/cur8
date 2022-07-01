import AWS, { S3 } from "aws-sdk";

const s3 = new S3({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function generateUploadURL(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { name, type } = req.body;

    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name,
      Expires: 120,
      ContentType: type,
      ACL: "public-read",
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ uploadURL });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}
