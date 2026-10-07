import prisma from "../prismaClient/client.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// Create movie
export async function createMovie(req, res) {
  try {
    const { title, description, year, rating, categoryIds } = req.body;

    let image = req.body.image || null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    if (!title || !image || !year || !rating || !categoryIds) {
      return res.status(400).json({
        message: "movie fields are missing",
      });
    }

    if (!categoryIds) {
      return res.status(400).json({
        message: "Category IDs are required",
      });
    }

    const parsedCategoryIds = JSON.parse(categoryIds);
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        image,
        year: Number(year),
        rating: Number(rating),
        categoryIds: parsedCategoryIds || [],
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
    console.log("GET /movies started");

    const movies = await prisma.movie.findMany({
      orderBy: {
        rating: "desc",
      },
    });

    console.log("MOVIES FETCHED:", movies.length);

    return res.status(200).json({
      data: movies,
    });
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch movies",
      error: error.message,
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
export async function patchMovie(req, res) {
  try {
    const { id } = req.params;
    const { title, description, year, rating, categoryIds, image } = req.body;
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

    if (categoryIds !== undefined) {
      updateData.categoryIds = Array.isArray(categoryIds)
        ? categoryIds
        : JSON.parse(categoryIds || "[]");
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
    console.error("PATCH MOVIE ERROR:", error);

    res.status(500).json({
      message: "Failed to patch movie",
      error: error.message,
    });
  }
}

//update movie
export async function updateMovie(req, res) {
  try {
    const { id } = req.params;
    const { title, description, year, rating, categoryIds, image } = req.body;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    // Required fields
    if (
      !title ||
      !description ||
      year === undefined ||
      rating === undefined ||
      !categoryIds ||
      !image
    ) {
      return res.status(400).json({
        message: "All movie fields are required",
      });
    }

    let movieImage = image || null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      movieImage = result.secure_url;
    }

    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : JSON.parse(categoryIds);

    const movie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        description,
        year: Number(year),
        rating: Number(rating),
        categoryIds: parsedCategoryIds,
        image: movieImage,
      },
    });

    res.status(200).json({
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    console.error("PUT MOVIE ERROR:", error);

    res.status(500).json({
      message: "Failed to update movie",
      error: error.message,
    });
  }
}
