

// entry point  => load env. import express connect mongodb start server
import "dotenv/config";
import connectDB from "./db/index.js"
import app  from "./app.js"
import {DB_NAME} from "./constants.js"


connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`)
    })  
       console.log(`Connected to MongoDB database: ${DB_NAME}`);
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit the process with an error code
})
console.log("Cloudinary:", process.env.CLOUDINARY_CLOUD_NAME);