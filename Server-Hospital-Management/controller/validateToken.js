import { verifyToken } from "../utils/authentication/jwt.js";

const validateToken = (req, res) => {
  const headers = req.headers;
  const { token } = headers;

  // chcking prresence of token
  if (!token) {
    return res.json({
      role: null,
      message: "please attach token to verify",
    });
  }

  try {
    const tokenVerified = verifyToken(token);
    // verification failed
    if (!tokenVerified) {
      return res.json({ role: null, message: "token is not verified" });
    }

    return res.json({ message: "token  verified", role: tokenVerified.role });
  } catch (err) {
    return res.json({ message: "error in verifying token", role: null });
  }
};

export default validateToken;
