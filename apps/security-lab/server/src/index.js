import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import morgan from "morgan";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverRoot = join(__dirname, "..");

dotenv.config({ path: join(serverRoot, ".env") });
dotenv.config({ path: join(serverRoot, ".env.local"), override: true });

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET. Set it in .env or .env.local.");
  process.exit(1);
}
if (!REFRESH_SECRET) {
  console.error("Missing REFRESH_SECRET. Set it in .env or .env.local.");
  process.exit(1);
}

const fakeUser = {
  id: 1,
  userName: "Eric B",
  email: "test@test.com",
  password: "12345678",
};

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3008";

app.use(helmet());
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user data to request
    next(); // allow access
  } catch (err) {
    return res.sendStatus(401);
  }
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "security-lab-api" });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the security-lab-api",
    docs: "Add your security lab API routes here.",
  });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "You made it!",
    user: req.user,
  });
});

const LOGIN = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MAX_LENGTH: 1024,
};

function validateLoginBody(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, email: null, password: null };
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password =
    typeof body.password === "string" ? body.password.trim() : "";

  if (!(email && password)) {
    return { valid: false, email, password };
  }
  if (email.length > LOGIN.EMAIL_MAX_LENGTH) {
    return { valid: false, email: null, password: null };
  }
  if (password.length > LOGIN.PASSWORD_MAX_LENGTH) {
    return { valid: false, email: null, password: null };
  }
  return { valid: true, email, password };
}

app.post("/api/auth/login", (req, res) => {
  const { valid, email, password } = validateLoginBody(req.body);

  if (!valid) {
    return res.status(400).json({ message: "Bad request" });
  }

  if (email === fakeUser.email && password === fakeUser.password) {
    const token = jwt.sign(
      { userId: fakeUser.id, name: fakeUser.userName, email: fakeUser.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production (HTTPS)
    });

    return res.json({ message: "Login successful" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

app.post("/api/auth/refresh", (_req, res) => {
  res.json({
    message: "refresh",
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`security-lab-api listening on http://localhost:${port}`);
});
