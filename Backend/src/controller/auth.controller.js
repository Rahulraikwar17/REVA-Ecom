import UserModel from "../models/user.model..js";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExist = await UserModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exist with this email address",
      errors: [
        {
          field: "email",
          message: "User already exist with this email address",
        },
      ],
    });
  }

  const user = await UserModel.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });

  const accessToken = createAccessToken({ userId: user._id, role: user.role });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, { httpOnly: true });

  await UserModel.findByIdAndUpdate(user._id, { refreshToken });

  res.status(201).json({
    message: "user registered succesfully",
    data: {
      user: { email: user.email, name: user.name, id: user._id },
      accessToken,
    },
  });
};
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "user does not exist with this email",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "password is incorrect",
    });
  }

  const accessToken = createAccessToken({ userId: user._id, role: user.role });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, { httpOnly: true });

  await UserModel.findByIdAndUpdate(user._id, { refreshToken });

  res.status(200).json({
    message: "user logged in succesfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refresh Token is required",
    });
  }

  try {
    const decode = readRefreshToken(refreshToken);

    const { userId, role } = decode;

    const user = await UserModel.findById(userId);

    if (refreshToken != user.refreshToken) {
      await UserModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });

      return res.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const accessToken = createAccessToken({ userId, role });
    const newRefreshToken = createRefreshToken({ userId, role });
    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "Tokens rotated successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
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
  const { userId, role } = req.user;

  const user = await UserModel.findById(userId);

  res.status(200).json({
    message: "User data fetch successfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        role: user.role,
      },
    },
  });
};

export const logoutController = async (req, res) => {
  const { userId } = req.user;

  await UserModel.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });

  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Logout successful",
  });
};
