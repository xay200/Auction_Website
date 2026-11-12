
import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  console.error("❌ MONGODB_URI chưa được định nghĩa. Kiểm tra file .env.");
  process.exit(1);
}

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {   // ← đổi thành MONGODB_URI
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database: ${err}`);
    });
};