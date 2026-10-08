import prisma from "../prismaClient/client.js";

// Get currently logged-in user
export const currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Current user fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Current user error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET /users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET /users/:id
// Admin: get one user
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "User deleted successfully",
      data: {
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
