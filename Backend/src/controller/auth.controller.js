import UserModel from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";
import bcrypt from "bcrypt";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const serverError = (res, error) => {
  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
};

const duplicateEmail = (res) =>
  res.status(409).json({
    message: "User already exists with this email address",
    errors: [
      {
        field: "email",
        message: "User already exists with this email address",
      },
    ],
  });

export const registerController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return duplicateEmail(res);
    }

    const user = await UserModel.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });

    const tokenPayload = { userId: user._id, role: user.role };
    const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken(tokenPayload);

    await UserModel.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        user: toSafeUser(user),
        accessToken,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return duplicateEmail(res);
    }

    return serverError(res, error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const tokenPayload = { userId: user._id, role: user.role };
    const accessToken = createAccessToken(tokenPayload);
    const refreshToken = createRefreshToken(tokenPayload);

    await UserModel.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: toSafeUser(user),
        accessToken,
      },
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required",
    });
  }

  try {
    const { userId } = readRefreshToken(refreshToken);

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (refreshToken !== user.refreshToken) {
      await UserModel.findByIdAndUpdate(user._id, { refreshToken: null });

      return res.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const tokenPayload = { userId: user._id, role: user.role };
    const accessToken = createAccessToken(tokenPayload);
    const newRefreshToken = createRefreshToken(tokenPayload);

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Tokens rotated successfully",
      data: {
        user: toSafeUser(user),
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

export const getMeController = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User data fetched successfully",
      data: {
        user: toSafeUser(user),
      },
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const logoutController = async (req, res) => {
  try {
    const { userId } = req.user;

    await UserModel.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });

    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return serverError(res, error);
  }
};