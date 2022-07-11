import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  if (req.method === "POST") {
    return await createProfile(req, res);
  }
}

async function createProfile(req, res) {
  const { name, role, instagram, number } = req.body.formData;
  console.log(name, role, instagram, number);

  try {
    const session = await getSession({ req });
    const userId = session.user.id;

    // Find the current logged in user and update their information using the form data.
    const createProfile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        role,
        instagram,
        number,
      },
    });
    return res.status(200).json(createProfile, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating profile", success: false });
  }
}
