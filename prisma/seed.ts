import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productImages = [
  "linear-gradient(135deg,#f2f7e9,#cde0b8 48%,#708c55)",
  "linear-gradient(135deg,#fbf4df,#e2b66e 50%,#6d4c26)",
  "linear-gradient(135deg,#ecf8f1,#91c7a3 48%,#35664a)",
  "linear-gradient(135deg,#fff6ef,#dd997d 48%,#723c31)",
  "linear-gradient(135deg,#f4f7ff,#aebee6 50%,#405480)",
  "linear-gradient(135deg,#fffbea,#e3cf7c 50%,#80662a)",
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.adminUser.deleteMany();

  const categories = await Promise.all(
    [
      ["Herbal Medicines", "herbal-medicines", "Trusted Unani and herbal formulas for everyday wellness."],
      ["Organic Herbs", "organic-herbs", "Premium loose herbs, seeds, powders, and natural pantry staples."],
      ["Oils & Honey", "oils-honey", "Cold-pressed oils, pure honey, and traditional household essentials."],
      ["Hair & Skin Care", "hair-skin-care", "Natural care products for hair, skin, and personal care routines."],
    ].map(([name, slug, description]) =>
      prisma.category.create({ data: { name, slug, description } }),
    ),
  );

  const bySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));

  const products = [
    {
      name: "Karakoram Shilajit Resin 30g",
      slug: "karakoram-shilajit-resin-30g",
      description: "A mineral-rich resin prepared for customers who prefer traditional strength and stamina support.",
      benefits: "Supports vitality, daily energy, and recovery from fatigue.",
      usage: "Take a pea-sized amount in warm milk or water once daily, or as advised by a practitioner.",
      packing: "30g sealed glass jar",
      regularPrice: 6200,
      salePrice: 4500,
      stock: 18,
      featured: true,
      bestSeller: true,
      categorySlug: "herbal-medicines",
    },
    {
      name: "Moringa Leaf Powder",
      slug: "moringa-leaf-powder",
      description: "Fine-ground moringa leaves for smoothies, warm drinks, and daily nutrition routines.",
      benefits: "A natural source of plant nutrients and antioxidants.",
      usage: "Mix half to one teaspoon with water, juice, or food once daily.",
      packing: "100g resealable pouch",
      regularPrice: 650,
      salePrice: 520,
      stock: 42,
      featured: true,
      bestSeller: true,
      categorySlug: "organic-herbs",
    },
    {
      name: "Joshanda Herbal Blend",
      slug: "joshanda-herbal-blend",
      description: "A comforting herbal tea blend for seasonal wellness and warm evening routines.",
      benefits: "Helps soothe the throat and supports respiratory comfort.",
      usage: "Boil one sachet in a cup of water for 3-5 minutes. Drink warm.",
      packing: "45g box",
      regularPrice: 260,
      salePrice: 210,
      stock: 66,
      featured: false,
      bestSeller: true,
      categorySlug: "herbal-medicines",
    },
    {
      name: "Pure Berri Honey",
      slug: "pure-berri-honey",
      description: "Naturally sweet honey selected for everyday breakfast, drinks, and household use.",
      benefits: "A clean pantry staple with a rich taste and smooth texture.",
      usage: "Use as a natural sweetener or take one spoon daily.",
      packing: "500g jar",
      regularPrice: 1800,
      salePrice: 1490,
      stock: 25,
      featured: true,
      bestSeller: false,
      categorySlug: "oils-honey",
    },
    {
      name: "Adivasi Hair Oil",
      slug: "adivasi-hair-oil",
      description: "A botanical hair oil blend for scalp massage and weekly care rituals.",
      benefits: "Supports scalp nourishment and helps reduce dry, brittle hair feel.",
      usage: "Massage into scalp 2-3 times weekly and wash after 2 hours.",
      packing: "120ml bottle",
      regularPrice: 2350,
      salePrice: 1850,
      stock: 15,
      featured: false,
      bestSeller: true,
      categorySlug: "hair-skin-care",
    },
    {
      name: "Cold Pressed Mustard Oil",
      slug: "cold-pressed-mustard-oil",
      description: "Aromatic mustard oil prepared for cooking, massage, and traditional household use.",
      benefits: "Rich flavor, warming feel, and versatile everyday utility.",
      usage: "Use as preferred for cooking or external massage.",
      packing: "250ml bottle",
      regularPrice: 720,
      salePrice: null,
      stock: 31,
      featured: true,
      bestSeller: false,
      categorySlug: "oils-honey",
    },
    {
      name: "Psyllium Husk Premium",
      slug: "psyllium-husk-premium",
      description: "Clean, premium ispaghol husk for digestion-focused routines.",
      benefits: "Supports digestive regularity when taken with sufficient water.",
      usage: "Mix one teaspoon in a glass of water and drink immediately.",
      packing: "100g pouch",
      regularPrice: 520,
      salePrice: 430,
      stock: 54,
      featured: false,
      bestSeller: false,
      categorySlug: "organic-herbs",
    },
    {
      name: "Multani Mitti Clay",
      slug: "multani-mitti-clay",
      description: "Fine natural clay powder for face masks and traditional skincare.",
      benefits: "Helps absorb excess oil and leaves skin feeling refreshed.",
      usage: "Mix with rose water, apply for 8-10 minutes, then rinse.",
      packing: "150g pouch",
      regularPrice: 300,
      salePrice: 240,
      stock: 73,
      featured: false,
      bestSeller: true,
      categorySlug: "hair-skin-care",
    },
  ];

  await Promise.all(
    products.map((product, index) =>
      prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          benefits: product.benefits,
          usage: product.usage,
          packing: product.packing,
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          stock: product.stock,
          featured: product.featured,
          bestSeller: product.bestSeller,
          images: JSON.stringify([productImages[index % productImages.length]]),
          categoryId: bySlug[product.categorySlug].id,
        },
      }),
    ),
  );

  await prisma.certificate.createMany({
    data: [
      {
        title: "Product Authenticity Certificate",
        type: "Certificate",
        description: "Internal quality assurance certificate placeholder for herbal product sourcing.",
        fileUrl: "linear-gradient(135deg,#f8fbf2,#cedbb3)",
        published: true,
      },
      {
        title: "Batch Lab Report",
        type: "Lab Report",
        description: "Sample lab report placeholder for purity, packaging, and batch review.",
        fileUrl: "linear-gradient(135deg,#f4f8ff,#b8c8e8)",
        published: true,
      },
      {
        title: "Supplier Verification",
        type: "Certificate",
        description: "Supplier verification placeholder for future scanned documentation.",
        fileUrl: "linear-gradient(135deg,#fff8ee,#e1b883)",
        published: true,
      },
    ],
  });

  await prisma.siteSetting.create({
    data: {
      storeName: "Herbal Shop",
      phone: "+92 300 0000000",
      whatsappNumber: "923000000000",
      address: "Karachi, Pakistan",
      shippingText: "Nationwide delivery in 3-5 working days with Cash on Delivery.",
      supportCopy: "Need help choosing a remedy? Our support team can guide you on WhatsApp.",
    },
  });

  await prisma.adminUser.create({
    data: {
      email: "admin@herbal.local",
      passwordHash: await bcrypt.hash("Admin123!", 10),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded. Admin: admin@herbal.local / Admin123!");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
