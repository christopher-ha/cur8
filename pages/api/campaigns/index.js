import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const session = await getSession({
    req,
  });
  const userId = session.user.id;

  const { name, description, location, date } = req.body;
  console.log(name, description, location, date);
  console.log(new Date(date));

  const campaign = await prisma.campaigns.create({
    data: {
      name,
      description,
      location,
      date: new Date(date),
    },
  });

  // Find the logged in user's information (get the role)
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log(user);

  // Automatically generate a team linking the campaignId and userId, along with auto-filling their role for that team. This can be edited later. Give this user "Creator" level permissions.
  const team = await prisma.teams.create({
    data: {
      campaignId: campaign.id,
      userId: userId,
      role: user.role,
      permissions: "Creator",
    },
  });
  res.json({ campaign, team });

  // if (!session) {
  //   res.status(401).json({
  //     error: "Unauthenticated user",
  //   });
  // } else {
  //   res.status(200).json({
  //     message: "Success",
  //     userId,
  //   });
  // }
}
