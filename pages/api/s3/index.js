import { NextApiRequest, NextApiResponse } from "next";
import AWS, { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3({
  region: process.env.S3_UPLOAD_REGION,
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handle(req, res) {
  if (req.method === "POST") {
    return await generateUploadURL(req, res);
  } else if (req.method === "DELETE") {
    return await deleteObject(req, res);
  }
}

async function generateUploadURL(req, res) {
  const { name, type } = req.body;

  try {
    const fileParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: `images/${uuidv4()}/${name.replace(/\s/g, "-")}`,
      Expires: 600,
      ContentType: type,
      ACL: "public-read",
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

async function deleteObject(req, res) {
  let { key } = req.body;
  // Removes the slash from the beginning of the Key, otherwise it won't work.
  // /images/... ———> images/...
  key = key.slice(1);
  console.log(key);

  try {
    const response = await s3
      .deleteObject({
        Bucket: process.env.S3_UPLOAD_BUCKET,
        Key: key,
      })
      .promise();
    res.status(200).send(response.body);
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error deleting item", success: false });
  }
}
