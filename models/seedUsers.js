// seedUsers.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./User.js"; 

const MONGO_URI = "mongodb://127.0.0.1:27017/school-ems";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing users (optional)
    await User.deleteMany({});
    console.log("🗑️ Cleared existing users");

    // Create users
    const users = [
      { username: "admin1", password: "Admin123!", role: "Admin" },
      { username: "manager1", password: "Manager123!", role: "Manager" },
      { username: "employee1", password: "Employee123!", role: "Employee" },
    ];

    for (let u of users) {
      const hashedPassword = bcrypt.hashSync(u.password, 8);
      const user = new User({ username: u.username, password: hashedPassword, role: u.role });
      await user.save();
      console.log(`✅ Created ${u.role}: ${u.username}`);
    }

    console.log("🎉 Seeding complete!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seed();
