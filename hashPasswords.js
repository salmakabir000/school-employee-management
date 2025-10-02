// hashPasswords.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // adjust path if needed

const MONGO_URI = "mongodb://127.0.0.1:27017/school-ems";

async function hashPasswords() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB ✅");

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (let user of users) {
      // Skip already hashed passwords (they start with $2)
      if (!user.password.startsWith("$2")) {
        const hashed = bcrypt.hashSync(user.password, 8);
        user.password = hashed;
        await user.save();
        console.log(`Hashed password for ${user.username}`);
      }
    }

    console.log("All passwords hashed successfully ✅");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

hashPasswords();
