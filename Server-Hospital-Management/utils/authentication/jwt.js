import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const seceretKey = process.env.JWT_SECRET_KEY;
const expiresIn = 7 * 24 * 60 * 60 * 60; // 7 days

export const generateToken = (payLoad) => {
  const token = jwt.sign(payLoad, seceretKey, { expiresIn: expiresIn });
  return token;
};

export const verifyToken = (token) => {
  try {
    const payLoad = jwt.verify(token, seceretKey);
    return payLoad;
  } catch (err) {
    return null;
  }
};
