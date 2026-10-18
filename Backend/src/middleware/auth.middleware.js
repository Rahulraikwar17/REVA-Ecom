import { readAccessToken } from "../utils/auth.utils.js";

export const authenticate = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token not found in request header",
    });
  }

  try {
    const decode = readAccessToken(accessToken);

    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

export const authenticateSeller = (req, res, next) => {
  const { role } = req.user;
  console.log(req.user);
  console.log(role);
  if (role !== "seller") {
    return res.status(403).json({
      message: "user is not authorized to create product",
    });
  }

  next();
};
