import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./prismaClient/client.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// USERS
// =====================================

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });

    res.json({
      data: users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Get single user
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          include: {
            categories: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json({
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json({
      msg: "User created",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================
// CATEGORIES
// =====================================

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      data: categories,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================
// POSTS
// =====================================

// Get posts
app.get("/posts", async (req, res) => {
  try {
    const { category } = req.query;

    let where = {};

    // If category was selected
    if (category) {
      where = {
        categories: {
          some: {
            id: category,
          },
        },
      };
    }

    const posts = await prisma.post.findMany({
      where,

      include: {
        user: true,
        categories: true,
      },

      orderBy: {
        id: "desc",
      },
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Get single post
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        categories: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    res.json({
      data: post,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Create post
app.post("/posts", async (req, res) => {
  try {
    const { user_id, name, category_ids } = req.body;

    const post = await prisma.post.create({
      data: {
        name,

        user: {
          connect: {
            id: user_id,
          },
        },

        categories: {
          connect: category_ids.map((id) => ({
            id,
          })),
        },
      },

      include: {
        user: true,
        categories: true,
      },
    });

    res.status(201).json({
      msg: "Post created",
      data: post,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
