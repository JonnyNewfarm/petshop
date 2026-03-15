import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Dogs",
        slug: "dogs",
      },
    }),
    prisma.category.create({
      data: {
        name: "Cats",
        slug: "cats",
      },
    }),
    prisma.category.create({
      data: {
        name: "Small Pets",
        slug: "small-pets",
      },
    }),
    prisma.category.create({
      data: {
        name: "Birds",
        slug: "birds",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fish",
        slug: "fish",
      },
    }),
  ]);

  const categoryMap = Object.fromEntries(
    categories.map((category) => [category.slug, category.id])
  );

  const products = [
    {
      name: "Orthopedic Dog Bed",
      slug: "orthopedic-dog-bed",
      description:
        "A supportive orthopedic bed designed to give dogs better rest and everyday comfort.",
      price: 899,
      stock: 14,
      featured: true,
      categorySlug: "dogs",
      images: [
        { url: "/products/dog-bed-1.jpg", alt: "Orthopedic dog bed front", order: 0 },
        { url: "/products/dog-bed-2.jpg", alt: "Orthopedic dog bed side", order: 1 },
        { url: "/products/dog-bed-3.jpg", alt: "Orthopedic dog bed detail", order: 2 },
      ],
    },
    {
      name: "Natural Dog Treats",
      slug: "natural-dog-treats",
      description:
        "Tasty natural treats for dogs, perfect for training, rewards and daily enjoyment.",
      price: 149,
      stock: 38,
      featured: true,
      categorySlug: "dogs",
      images: [
        { url: "/products/dog-treats-1.jpg", alt: "Natural dog treats pack", order: 0 },
        { url: "/products/dog-treats-2.jpg", alt: "Natural dog treats close-up", order: 1 },
      ],
    },
    {
      name: "Interactive Rope Toy",
      slug: "interactive-rope-toy",
      description:
        "A durable rope toy made for tug, play and everyday activity for energetic dogs.",
      price: 199,
      stock: 22,
      featured: false,
      categorySlug: "dogs",
      images: [
        { url: "/products/rope-toy-1.jpg", alt: "Interactive rope toy", order: 0 },
        { url: "/products/rope-toy-2.jpg", alt: "Interactive rope toy detail", order: 1 },
      ],
    },
    {
      name: "Minimal Ceramic Cat Bowl",
      slug: "minimal-ceramic-cat-bowl",
      description:
        "A clean ceramic bowl designed for comfortable everyday feeding for cats.",
      price: 229,
      stock: 26,
      featured: true,
      categorySlug: "cats",
      images: [
        { url: "/products/cat-bowl-1.jpg", alt: "Ceramic cat bowl front", order: 0 },
        { url: "/products/cat-bowl-2.jpg", alt: "Ceramic cat bowl angle", order: 1 },
      ],
    },
    {
      name: "Cat Scratching Tower",
      slug: "cat-scratching-tower",
      description:
        "A compact scratching tower that helps cats stay active while protecting furniture.",
      price: 649,
      stock: 9,
      featured: true,
      categorySlug: "cats",
      images: [
        { url: "/products/cat-tower-1.jpg", alt: "Cat scratching tower", order: 0 },
        { url: "/products/cat-tower-2.jpg", alt: "Cat scratching tower detail", order: 1 },
        { url: "/products/cat-tower-3.jpg", alt: "Cat scratching tower side", order: 2 },
      ],
    },
    {
      name: "Feather Teaser Wand",
      slug: "feather-teaser-wand",
      description:
        "A playful teaser wand designed to keep indoor cats active and entertained.",
      price: 129,
      stock: 41,
      featured: false,
      categorySlug: "cats",
      images: [
        { url: "/products/feather-wand-1.jpg", alt: "Feather teaser wand", order: 0 },
        { url: "/products/feather-wand-2.jpg", alt: "Feather teaser wand detail", order: 1 },
      ],
    },
    {
      name: "Cozy Small Pet Hideout",
      slug: "cozy-small-pet-hideout",
      description:
        "A soft and cozy hideout for rabbits, guinea pigs and other small pets.",
      price: 399,
      stock: 12,
      featured: true,
      categorySlug: "small-pets",
      images: [
        { url: "/products/small-pet-house-1.jpg", alt: "Small pet hideout front", order: 0 },
        { url: "/products/small-pet-house-2.jpg", alt: "Small pet hideout side", order: 1 },
      ],
    },
    {
      name: "Wood Chew Toy Set",
      slug: "wood-chew-toy-set",
      description:
        "A practical chew toy set made for enrichment and daily activity for small pets.",
      price: 179,
      stock: 19,
      featured: false,
      categorySlug: "small-pets",
      images: [
        { url: "/products/chew-set-1.jpg", alt: "Wood chew toy set", order: 0 },
        { url: "/products/chew-set-2.jpg", alt: "Wood chew toy set detail", order: 1 },
      ],
    },
    {
      name: "Bird Perch Stand",
      slug: "bird-perch-stand",
      description:
        "A stable perch stand designed to give birds a comfortable resting and play area.",
      price: 299,
      stock: 11,
      featured: false,
      categorySlug: "birds",
      images: [
        { url: "/products/bird-perch-1.jpg", alt: "Bird perch stand", order: 0 },
        { url: "/products/bird-perch-2.jpg", alt: "Bird perch stand detail", order: 1 },
      ],
    },
    {
      name: "Seed Mix Premium",
      slug: "seed-mix-premium",
      description:
        "A balanced premium seed mix for everyday feeding for a variety of birds.",
      price: 159,
      stock: 34,
      featured: true,
      categorySlug: "birds",
      images: [
        { url: "/products/bird-seed-1.jpg", alt: "Premium bird seed mix", order: 0 },
        { url: "/products/bird-seed-2.jpg", alt: "Premium bird seed mix pack", order: 1 },
      ],
    },
    {
      name: "Aquarium Plant Set",
      slug: "aquarium-plant-set",
      description:
        "A decorative aquarium plant set designed to create a more natural underwater space.",
      price: 249,
      stock: 24,
      featured: false,
      categorySlug: "fish",
      images: [
        { url: "/products/fish-plants-1.jpg", alt: "Aquarium plant set", order: 0 },
        { url: "/products/fish-plants-2.jpg", alt: "Aquarium plant detail", order: 1 },
      ],
    },
    {
      name: "Fish Tank Gravel Mix",
      slug: "fish-tank-gravel-mix",
      description:
        "A clean decorative gravel mix made for freshwater aquariums.",
      price: 189,
      stock: 27,
      featured: false,
      categorySlug: "fish",
      images: [
        { url: "/products/fish-gravel-1.jpg", alt: "Fish tank gravel mix", order: 0 },
        { url: "/products/fish-gravel-2.jpg", alt: "Fish tank gravel close-up", order: 1 },
      ],
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        featured: product.featured,
        categoryId: categoryMap[product.categorySlug],
        images: {
          create: product.images,
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });