import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import schemas from "../utils/schemas.js";
import { prisma } from "database";
import type { Request, Response, NextFunction } from "express";

async function registerAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, name, password } = schemas.auth.register.parse(req.body);
    const existing = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    const doesAdminExist = await prisma.user.findFirst({
      where: {
        admin: true,
      },
      select: {
        admin: true,
      },
    });

    if (existing) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPass,
        admin: !doesAdminExist,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.JWT_KEY as string,
      { expiresIn: "48h" },
    );

    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=172800`,
    );

    res.status(200).json({
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
}

async function logIntoAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = schemas.auth.login.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "No user found with that email",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        message: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_KEY as string,
      { expiresIn: "48h" },
    );

    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=172800`,
    );

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function addUploadToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = schemas.identifier.parse(req.body.token);
    await prisma.user.update({
      where: {
        id: req.user!.userId,
      },
      data: {
        uploadToken: token,
      },
    });

    res.sendStatus(204);
    return;
  } catch (e) {
    next(e);
  }
}

async function getUserAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user!.email, // it will be defined at this point idc lol
      },
      select: {
        email: true,
        name: true,
        admin: true,
        uploadToken: true,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "Key provided, but no user found?",
      });
      return;
    }

    res.status(200).json({
      ...user,
      uploadToken: !!user?.uploadToken,
    });
    return;
  } catch (e) {
    next(e);
  }
}

async function hasAdminRegistered(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        admin: true,
      },
    });

    res.status(200).json({
      registered: !!admin,
    });
    return;
  } catch (e) {
    next(e);
  }
}

export default {
  registerAccount,
  logIntoAccount,
  getUserAccount,
  hasAdminRegistered,
  addUploadToken,
};
