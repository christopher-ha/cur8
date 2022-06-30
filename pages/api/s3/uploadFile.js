import fs from "fs";
import AWS, { S3 } from "aws-sdk";
import formidable from "formidable";
import { V4MAPPED } from "dns";
import { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { name, type } = req.body;

    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name,
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

// const s3Client = new AWS.S3({
//   // endpoint: process.env.DO_SPACES_URL,
//   region: "us-east-2",
//   credentials: {
//     accessKeyID: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   },
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   const form = formidable();
//   form.parse(req, async (err, fields, files) => {
//     if (!files.filename) {
//       res.status(400).send("No file uploaded");
//       return;
//     }

//     try {
//       return s3Client.putObject(
//         {
//           Bucket: process.env.AWS_BUCKET_NAME,
//           Key: files.filename.originalFilename,
//           Body: fs.createReadStream(files.demo.filepath),
//           ACL: "public-read",
//         },
//         async () => res.status(201).send("Successful file upload")
//       );
//     } catch (e) {
//       console.log(e);
//       res.status(500).send("Error uploading file");
//     }
//   });
// }
