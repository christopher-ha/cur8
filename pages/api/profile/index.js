import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({
    req,
  });

  const userId = session.user.id;

  if (!session) {
    res.status(401).json({
      error: "Unauthenticated user",
    });
  } else {
    res.status(200).json({
      message: "Success",
      userId,
    });
  }
};

// // POST /api/profile
// // Required fields in body: title
// // Optional fields in body: content
// export default async function Handle(req, res) {
//   const session = await unstable_getServerSession(req, res);
//   if (session) {
//     // Signed in
//     console.log("Session", JSON.stringify(session, null, 2));
//   } else {
//     // Not Signed in
//     res.status(401);
//   }
//   res.end();

//   // const { userId } = session;
//   // console.log(userId);
//   // const result = await prisma.post.update({
//   //   where: {
//   //     email:
//   //   }
//   //   data: {
//   //     name,
//   //     instagram,
//   //     number,
//   //   },
//   // });
//   // res.json(result);
//   // res.send("Works");
//   // res.status(200).json(req.body);
// }
