const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      campaign_id: "cl537x8ri000409labzyn83ls",
      user_id: "cl4zm45qa0006gdao4bvsq672",
      role: "Creative Technologist",
    },
  });

  const callsheet = await prisma.callsheet.create({
    data: {
      id: "cl538na1f000209l3gy1hcu0j",
      campaign_id: "cl537x8ri000409labzyn83ls",
      time: "00:00:00.0000000",
      task: "Prep",
      notes: "Stylist, CD, and Photographer arrive to studio",
    },
  });

  const wardrobe = await prisma.wardrobe.createMany({
    data: [
      {
        id: "cl538pdb7000309l3bvt1251w",
        campaign_id: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221429F063003_1/hyein-seo-black-polyester-jacket.jpg",
        brand: "HYEIN SEO",
        description: "Black Polyester Jacket",
        category: "tops",
        size: "M",
      },
      {
        id: "cl538phj1000409l3hi3ubcyu",
        campaign_id: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221253F087005_1/junya-watanabe-black-wool-trousers.jpg",
        brand: "JUNYA WATANABE",
        description: "Black Wool Trousers",
        category: "bottoms",
        size: "S",
      },
      {
        id: "cl538plfc000509l337ea1yi6",
        campaign_id: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221245F122001_1/comme-des-garcons-white-nike-edition-premier-sneaker-heels.jpg",
        brand: "COMME des GARCONS",
        description: "White Nike Edition Premier Sneaker Heels",
        category: "shoes",
        size: "6W",
      },
      {
        id: "cl538pqza000609l30fis940d",
        campaign_id: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221778F014010_1/arcteryx-system-a-grey-faraday-beanie.jpg",
        brand: "ARC'TERYX SYSTEM A",
        description: "Grey Faraday Beanie",
        category: "accessory",
        size: "OS",
      },
      {
        id: "cl538pvuc000709l306p6b3q8",
        campaign_id: "cl537x8ri000409labzyn83ls",
        url: "https://img.ssensemedia.com/images/b_white,g_center,f_auto,q_auto:best/221646F048011_1/lemaire-black-egg-bag.jpg",
        brand: "LEMAIRE",
        description: "Black Egg Bag",
        category: "accessory",
        size: "OS",
      },
    ],
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
