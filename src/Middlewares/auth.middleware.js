//verify JWT
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utitles/ApiError.js";

const verifyJWT = async (req, res, next) => {

  try {
    //get access token from cookies
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // Check if token exists
    if (!token) {
      throw new ApiError(401, " Unauthorized request");
    }

    console.log("Token received:", !!token);
    // Verify token
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded token:", decodedtoken);
    // Find user from decoded token
    const user = await User.findById(decodedtoken._id).select(
      "-password -refreshToken",
    );

console.log("User found:", user);
    // Check if user exists
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    // Attach user to request
    req.user = user;
    // Continue to controller
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
