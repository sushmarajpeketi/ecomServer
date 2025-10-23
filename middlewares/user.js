import jwt from "jsonwebtoken";

let authenticate = (req, res, next) => {
  console.log("auth check middleware");
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .send({ error: "No token provided. Authentication failed!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      
     
    };
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return res.status(400).send({ error: "Invalid or expired token!" });
  }
};
export default authenticate;
