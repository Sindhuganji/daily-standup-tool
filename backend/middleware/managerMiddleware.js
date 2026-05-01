import jwt from 'jsonwebtoken';

const managerMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain role from login token payload
    if (decoded.role !== "manager") {
      return res.status(403).json({ message: "Manager access only" });
    }

    // keep consistent shape with existing middleware usage
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    next();
  } catch (error) {
    console.error("[MANAGER MIDDLEWARE ERROR]:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default managerMiddleware;