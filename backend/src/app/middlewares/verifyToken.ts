import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


interface CustomRequest extends Request {
  realUser?: string | JwtPayload;
}
interface AdminJWTPayload extends JwtPayload {
  role: "admin";
}

export const verifyAdminToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  console.log('authheader', authHeader)
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
      redirectTo: "/auth/login",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as
      AdminJWTPayload


    if (decoded.role !== "admin") {
      console.log("User is not an admin");
      res.status(403).json({
        success: false,
        message: "Forbidden access",
        redirectTo: "/auth/login",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({
      success: false,
      message: "Forbidden access",
      redirectTo: "/auth/login",
    });
    return;
  }
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  console.log("Authorization token:", token);

  if (!token) {
    console.log("No token provided");
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
      redirectTo: "/auth/login",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as
      | string
      | JwtPayload;
    console.log("Decoded token:", decoded);


    req.realUser = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({
      success: false,
      message: "Forbidden access",
      redirectTo: "/auth/login",
    });
    return;
  }
};
