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
    const rembgFile = await axios
      .get(`http://13.58.192.71:5000/?url=${file}`)
      .then((response) => {
        console.log(response);
      });
    // return res.status(200).json(rembgFile, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error using rembg", success: false });
  }
}
