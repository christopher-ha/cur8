import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await saveLook(req, res);
  }
}

async function saveLook(req, res) {
  const session = await getSession({ req });
  const userId = session.user.id;

  const { face, tops, bottoms, shoes, accessories, campaignId } = req.body;

  try {
    console.log(req.body);

    // Store the ids of the models face and items inside of the database.
    const look = await prisma.savedLooks.create({
      data: {
        campaignId: campaignId,
        model: face,
        tops: tops,
        bottoms: bottoms,
        shoes: shoes,
        accessories: accessories,
      },
    });
    return res.status(200).json(look, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating campaign", success: false });
  }
}
