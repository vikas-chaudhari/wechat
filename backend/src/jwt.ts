import jwt, { JsonWebTokenError } from "jsonwebtoken";

export const generateToken = async (username: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  // Generate the token
  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  return token;
};

export const verifyToken = async (token: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload) {
      return payload;
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    throw new Error("Invalid or expired token");
  }
};
