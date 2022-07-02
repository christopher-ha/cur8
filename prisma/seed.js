// const { PrismaClient } = require("@prisma/client");
const { prisma } = require("../utils/db");

async function main() {
  const campaign = await prisma.campaigns.create({
    data: {
      id: "cl537x8ri000409labzyn83ls",
      name: "Reflections",
      description: "Will we ever be those kids again?",
      location: "Toronto, ON",
      date: "2022-07-02T00:00:00Z",
    },
  });

  const team = await prisma.team.create({
    data: {
      id: "cl538m0cx000009l3hs88fly9",
      campaignId: "cl537x8ri000409labzyn83ls",
      userId: "cl539run600084raompredllf",
      role: "Creative Technologist",
      permissions: "Creator",
    },
  });

  const callsheet = await prisma.callSheet.create({
    data: {
      id: "cl538na1f000209l3gy1hcu0j",
      campaignId: "cl537x8ri000409labzyn83ls",
      time: "2022-07-02T16:00:00Z",
      task: "Prep",
      notes: "Stylist, CD, and Photographer arrive to studio",
    },
  });

  const wardrobe = await prisma.wardrobe.createMany({
    data: [
      {
        id: "cl538pdb7000309l3bvt1251w",
        campaignId: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221429F063003_1/hyein-seo-black-polyester-jacket.jpg",
        brand: "HYEIN SEO",
        description: "Black Polyester Jacket",
        category: "tops",
        size: "M",
      },
      {
        id: "cl538phj1000409l3hi3ubcyu",
        campaignId: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221253F087005_1/junya-watanabe-black-wool-trousers.jpg",
        brand: "JUNYA WATANABE",
        description: "Black Wool Trousers",
        category: "bottoms",
        size: "S",
      },
      {
        id: "cl538plfc000509l337ea1yi6",
        campaignId: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221245F122001_1/comme-des-garcons-white-nike-edition-premier-sneaker-heels.jpg",
        brand: "COMME des GARCONS",
        description: "White Nike Edition Premier Sneaker Heels",
        category: "shoes",
        size: "6W",
      },
      {
        id: "cl538pqza000609l30fis940d",
        campaignId: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221778F014010_1/arcteryx-system-a-grey-faraday-beanie.jpg",
        brand: "ARC'TERYX SYSTEM A",
        description: "Grey Faraday Beanie",
        category: "accessory",
        size: "OS",
      },
      {
        id: "cl538pvuc000709l306p6b3q8",
        campaignId: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221646F048011_1/lemaire-black-egg-bag.jpg",
        brand: "LEMAIRE",
        description: "Black Egg Bag",
        category: "accessory",
        size: "OS",
      },
    ],
  });

  const moodboards = await prisma.moodboards.create({
    data: {
      id: "cl538wgp5000009ihcgbnbywb",
      campaignId: "cl537x8ri000409labzyn83ls",
      name: "Hair & Makeup",
    },
  });

  const images = await prisma.images.create({
    data: {
      id: "cl538y3q4000109ih9h5da38h",
      moodboardId: "cl538wgp5000009ihcgbnbywb",
      url: "https://instagram.fyto1-1.fna.fbcdn.net/v/t51.2885-15/278693581_404150767838992_3495878835645493285_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fyto1-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=5Uv6VKu2lsEAX-ozGox&edm=AGenrX8BAAAA&ccb=7-5&oh=00_AT_6vWwZUnVl1zJbQciYFeQzjgCbWBQMDyd7F2XS4XLPaw&oe=62B99196&_nc_sid=5eceaa",
      description: "Marc Jacobs Heavn by @ooo___ing studio",
    },
  });

  const models = await prisma.models.create({
    data: {
      id: "cl538yxzn000209ih5kn96szz",
      campaignId: "cl537x8ri000409labzyn83ls",
      name: "Elena",
      urlFace:
        "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/222119F014001_1/nodress-black-bear-beanie.jpg",
      urlBody:
        "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/222119F110002_4/nodress-white-cotton-t-shirt.jpg",
      instagram: "@user01234567",
      agency: "Next Models",
      contact: "(647) 123-4567",
    },
  });

  const savedlooks = await prisma.savedLooks.create({
    data: {
      id: "cl5391kj7000309iha529edp4",
      campaignId: "cl537x8ri000409labzyn83ls",
      modelId: "cl538yxzn000209ih5kn96szz",
      topId: "cl538pdb7000309l3bvt1251w",
      bottomId: "cl538phj1000409l3hi3ubcyu",
      shoesId: "cl538plfc000509l337ea1yi6",
      accessory1Id: "cl538pqza000609l30fis940d",
      accessory2Id: "cl538pvuc000709l306p6b3q8",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
