import { User } from "../models/user.models.js";
import { ApiError } from "../utitles/ApiError.js";
import { ApiResponse } from "../utitles/ApiResponse.js";
import { asyncHandler } from "../utitles/asynhandler.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utitles/cloudianry.js";
import fs from "fs";
const registerUser = asyncHandler(async (req, res) => {
  try {
    // Get data from request body
    const { username, email, fullName, password } = req.body;

    // Check required fields
    if (!username || !email || !fullName || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      throw new ApiError(400, "Username or email already exists");
    }

    // Create new user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      fullName,
      password,
    });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in database
    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    // Remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          201,
          {
            user: createdUser,
            accessToken,
            refreshToken,
          },
          "User registered successfully",
        ),
      );
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong while registering user",
      errors: error.errors || [],
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    // 1. Get user data
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      throw new ApiError(400, "Email/username and password are required");
    }

    // 2. Find the user using email or username
    const user = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(username ? [{ username: username.toLowerCase() }] : []),
      ],
    });

    // 3. Check if user exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 4. Check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    // 5. Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken(); // Fixed typo

    // 6. Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 7. Remove sensitive information from the returned object
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    ); // Fixed typo & string formatting

    // 8. Cookie options
    const cookieOptions = {
      httpOnly: true, // Fixed "httpsOnly" typo to "httpOnly"
      secure: process.env.NODE_ENV === "production",
    };

    // 9. Send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully",
        ),
      );
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong while logging in",
      errors: error.errors || [],
    });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "contact user fetched successfully"),
      );
  } catch (error) {
    console.error("Get current  user error");
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching current user",
      errors: error.errors || [],
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.allowedNodeEnvironmentFlags.NODE_ENV === "PRODUCTION",
    sameSite: "Lax",
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // Get refresh token from cookie
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    // Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // Find user
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Compare incoming token with stored token
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Save new refresh token
    user.refreshToken = newRefreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully",
        ),
      );
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Invalid refresh token",
      errors: error.errors || [],
    });
  }
});

const uploadAvatar = asyncHandler(async (req, res) => {
  console.log("Uploaded file : ", req.file);

  if (!req.file) {
    throw new ApiError(200, "Avatar file is required");
  }
  // upload image from public/temp to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "taskforge/avatars",
  });
  console.log("Cloudinary result:", result);

  //delete temp file after successful upload
  fs.unlinkSync(req.file.path);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
      },
      "Avatar uploaded successfully",
    ),
  );
});
export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  uploadAvatar,
};
