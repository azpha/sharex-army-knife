import jwt from "jsonwebtoken";
import { prisma } from "database";
import type { Request, Response, NextFunction } from "express";
import schemas from "./schemas.js";

interface JWTPayload {
  userId: number;
  name: String;
  email: string;
}
declare module "express" {
  interface Request {
    user?: JWTPayload;
  }
}

async function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.authToken;
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY as string,
    ) as JWTPayload;
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
}

async function verifyUploadToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers["authorization"];
  const email = schemas.email.parse(req.query.email);

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(404).json({
      message: "That user does not exist",
    });
    return;
  }
  if (!user.uploadToken) {
    res.status(404).json({
      message: "That user has not set an upload token",
    });
    return;
  }

  if (user.uploadToken === token) {
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    next();
  } else {
    res.status(403).json({
      message: "Invalid upload token",
    });
  }
}

export { verifyAuth, verifyUploadToken };
