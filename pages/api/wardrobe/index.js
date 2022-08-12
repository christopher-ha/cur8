import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await rembg(req, res);
  }
}

async function rembg(req, res) {
  const { file } = req.body;
  console.log(file);

  try {
    await axios
      .get(`http://13.58.192.71:5000/?url=${file}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        return res.status(200).send(response.data);
      });
    // return res.status(200).json(rembgFile, { success: true });
    // return res.status(200).send(rembgFile);
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error using rembg", success: false });
  }
}
