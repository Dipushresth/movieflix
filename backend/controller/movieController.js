import prisma from "../prismaClient/client.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// Create movie
export async function createMovie(req, res) {
  try {
    const { title, description, year, rating, category_ids } = req.body;
    let image = req.body.image || null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    if (!title || !image || !year || !rating || !category_ids) {
      return res.status(400).json({
        message: "Required movie fields are missing",
      });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        image,
        year: Number(year),
        rating: Number(rating),
        categoryIds: category_ids || [],
      },
    });

    res.status(201).json({
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    console.log("CREATE MOVIE ERROR:", error);

    res.status(500).json({
      message: "Failed to create movie",
      error: error.message,
    });
  }
}

// Get all movies
export async function getMovies(req, res) {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        year: "desc",
      },
    });

    res.status(200).json({
      data: movies,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get movies",
    });
  }
}

// Get single movie
export async function getMovie(req, res) {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({
      data: movie,
    });
  } catch (error) {
    console.log("GET MOVIE ERROR:", error);

    res.status(500).json({
      message: "Failed to get movie",
      error: error.message,
    });
  }
}

// Update movie
export async function updateMovie(req, res) {
  try {
    const { id } = req.params;
    const { title, description, year, rating, category_ids, image } = req.body;
    const updateData = {};
    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (year !== undefined) {
      updateData.year = Number(year);
    }

    if (rating !== undefined) {
      updateData.rating = Number(rating);
    }

    if (category_ids !== undefined) {
      updateData.categoryIds = Array.isArray(category_ids)
        ? category_ids
        : JSON.parse(category_ids || "[]");
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    } else if (image !== undefined) {
      updateData.image = image;
    }
    const movie = await prisma.movie.update({
      where: {
        id,
      },
      data: updateData,
    });

    res.status(200).json({
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);

    res.status(500).json({
      message: "Failed to update movie",
      error: error.message,
    });
  }
}
