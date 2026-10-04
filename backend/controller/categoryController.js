import prisma from "../prismaClient/client.js";

// Create category
export async function category(req, res) {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json({
      msg: "Category created",
      data: category,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
}

// Get all categories
export async function getCategories(req, res) {
  try {
    console.log("MONGODB_URL exists:", !!process.env.MONGODB_URL);
    console.log(
      "MONGODB_URL starts with:",
      process.env.MONGODB_URL?.substring(0, 14),
    );
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get categories",
    });
  }
}
