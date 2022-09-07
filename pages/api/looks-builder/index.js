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

  const { face, top, bottom, shoes, accessory } = req.body.formData;
  console.log(face, top, bottom, shoes, accessory);

  try {
    // Create the campaign
    const campaign = await prisma.savedLooks.create({
      // data: {
      //   modelId: face,
      //   topId: top,
      //   bottomId:
      // },
    });

    // Find the logged in user's information
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Automatically generate a team linking the campaignId and userId, along with auto-filling their role for that team. This can be edited later. Give this user "Creator" level permissions.
    const team = await prisma.teams.create({
      data: {
        campaignId: campaign.id,
        userId: user.id,
        role: user.role,
        permissions: "Creator",
      },
    });
    return res.status(200).json(campaign, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating campaign", success: false });
  }
}
