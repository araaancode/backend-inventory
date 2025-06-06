// ***********************************
// ***** Environment Configuration *****
// ***********************************
require("dotenv").config({ path: __dirname + "/.env" });
const isProduction = process.env.NODE_ENV === "production";

// ********************************
// ***** External Dependencies *****
// ********************************
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const csrf = require("csurf");

// ********************************
// ***** Internal Dependencies *****
// ********************************
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const mongoErrorMiddleware = require("./middlewares/mongoError");
const rateLimiter = require("./middlewares/rateLimiter");
const logger = require("./middlewares/logger");
const connectDB = require("./config/db");
const { middleware: sanitizeMiddleware } = require("./middlewares/sanitize");

// ********************************
// ***** Database Connection *****
// ********************************
connectDB();

// ********************************
// ***** Express App Initialization *****
// ********************************
const app = express();

// ********************************
// ************ routes ************
// ********************************
// user routes
const authUserRoutes = require("./routes/users/auth");

// ********************************
// ***** Security Middlewares *****
// ********************************
app.use(
  helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: isProduction,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(rateLimiter);
app.use(sanitizeMiddleware); //
app.use(compression({ level: 6 }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(csrf());

// ********************************
// ***** Session Configuration *****
// ********************************
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    },
  })
);

// ********************************
// ***** Request Logging *****
// ********************************
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

if (!isProduction) {
  app.use(morgan("dev"));
}

// ********************************
// ***** API Routes *****
// ********************************
app.use("/api/users/auth", authUserRoutes);

// ********************************
// ***** Static Files *****
// ********************************
if (isProduction) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "API is running...",
      documentation: "http://localhost:5000/api-docs",
    });
  });
}

// ********************************
// ***** Error Handling *****
// ********************************
app.use(notFound);
app.use(errorHandler);
app.use(mongoErrorMiddleware);

// ***********************************
// ***** server setup *****
// ********************************
const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}... `);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
