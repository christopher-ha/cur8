// pages/api/s3-upload.js
import { APIRoute } from "next-s3-upload";
import { v4 as uuid } from "uuid";

export default APIRoute.configure({
  key(req, filename) {
    return `images/${uuid()}/${filename}`;
  },
});
