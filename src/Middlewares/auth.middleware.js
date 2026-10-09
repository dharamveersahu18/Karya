//verify JWT
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utitles/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Authorization:", req.header("Authorization"));

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token received:", !!token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded token:", decodedToken);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    console.log("User found:", user);

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Invalid access token",
    });
  }
};
export { verifyJWT };
