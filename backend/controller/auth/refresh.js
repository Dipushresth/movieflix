import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../utils/tokenUtils.js";

import prisma from "../../prismaClient/client.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    try {
      verifyRefreshToken(refreshToken);
    } catch (error) {
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token_hash: tokenHash,
      },
    });

    if (!storedToken) {
      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.status(403).json({
        message: "Refresh token not recognized, please log in again",
      });
    }

    if (storedToken.revoked) {
      await prisma.refreshToken.updateMany({
        where: {
          user_id: storedToken.user_id,
        },
        data: {
          revoked: true,
        },
      });
      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.status(401).json({
        message: "Refresh token has been revoked",
      });
    }

    if (storedToken.expires_at < new Date()) {
      await prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      });
      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.status(403).json({
        message: "Refresh token expired, please log in again",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: storedToken.user_id,
      },
    });

    if (!user) {
      await prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      });

      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.status(403).json({
        message: "User no longer exists",
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const newTokenHash = hashToken(newRefreshToken);

    await prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revoked: true,
      },
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash: newTokenHash,
        expires_at: expiresAt,
        revoked: false,
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...refreshCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}
