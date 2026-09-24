//task models ->  comment , notification activity

// project name , descripotuion,  users (members), owner, priority(Stautus + planning on progress, complter), created and update ,

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //member  may be are more than  1
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["PLANNING", "IN_PROGRESS", "COMPLETED"],
      default: "PLANNING",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Project = mongoose.model("Project", projectSchema);
