import { setDefaultResultOrder } from "node:dns";
import mongoose from "mongoose";
import os from "os";

// 1. FORCE IPv4 RESOLUTION (CRUCIAL FOR MOBILE)
setDefaultResultOrder("ipv4first");

// 2. CONNECTION URI (from environment or fallback)
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://tadesseabel26:t1HXuA3I5jWNe8t7@realstate1.w18z0x2.mongodb.net/Realstate1?retryWrites=true&w=majority&appName=RealState1JK";

// 3. TRANSFORM CONNECTION STRING FOR MOBILE
function getOptimizedConnectionString() {
  const isLikelyMobile = () => {
    const interfaces = os.networkInterfaces();
    return Object.values(interfaces).some((iface) =>
      iface.some(
        (addr) =>
          addr.family === "IPv4" &&
          (addr.address.startsWith("192.168.") ||
            addr.address.startsWith("172.20."))
      )
    );
  };

  if (isLikelyMobile()) {
    console.log("Mobile network detected - using direct connection");
    return MONGO_URI.replace("mongodb+srv://", "mongodb://").replace(
      /(\?|$)/,
      ":27017$1"
    );
  }
  return MONGO_URI;
}

// 4. CONNECTION WITH MULTI-STRATEGY FALLBACK
async function connectMongoDB() {
  const strategies = [
    () => mongoose.connect(getOptimizedConnectionString()),
    () => mongoose.connect(MONGO_URI.replace("mongodb+srv://", "mongodb://")),
    () => mongoose.connect(MONGO_URI, { directConnection: true }),
  ];

  for (const [i, strategy] of strategies.entries()) {
    try {
      await strategy();
      console.log(`✅ Connected using strategy ${i + 1}`);
      return;
    } catch (err) {
      console.warn(`⚠ Strategy ${i + 1} failed: ${err.message}`);
      if (i === strategies.length - 1) throw err;
    }
  }
}

// 5. EVENT HANDLERS
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// 6. GRACEFUL SHUTDOWN
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectMongoDB;
