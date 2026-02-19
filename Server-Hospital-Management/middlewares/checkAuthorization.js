import { verifyToken } from "../utils/authentication/jwt.js";

const checkAuthorization = (roles) => {
  // roles = []
  return (req, res, next) => {
    const cookies = req.cookies;
    const token = cookies.token;
    if (!token) {
      return res.json({ message: "no token found for authorization" });
    }

    try {
      const payLoad = verifyToken(token);
      if (!payLoad) {
        return res.json({ message: "invalid or expired token" });
      }

      const { id, role } = payLoad;
      if (!roles.includes(role) || !id) {
        return res.json({ message: "you are not authorized" });
      }

      req.role = role;
      req.id = id;
      return next();
    } catch (err) {
      return res.json({ message: "error in verifying authorization" });
    }
  };
};

export default checkAuthorization;
