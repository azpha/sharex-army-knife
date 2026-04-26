import { prisma } from "database";
import crypto from "node:crypto";
import schemas from "../utils/schemas.js";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";

async function createContent(req: Request, res: Response, next: NextFunction) {
  try {
    let identifier: String;

    if (req.file) {
      const { filename, originalname, mimetype } = req.file;
      if (!mimetype.includes("image/")) {
        await prisma.file.create({
          data: {
            identifier: filename,
            name: originalname,
            type: mimetype,
            userId: req.user!.userId,
          },
        });

        identifier = filename;
      } else {
        await prisma.screenshot.create({
          data: {
            identifier: filename,
            name: originalname,
            type: mimetype,
            userId: req.user!.userId,
          },
        });

        identifier = filename;
      }
    } else if (req.body.content) {
      const protoRegex = new RegExp(/^https?:\/\//);
      const isUrl = protoRegex.test(req.body.content);
      if (isUrl) {
        const fileId = crypto.randomBytes(4).toString("hex");
        await prisma.link.create({
          data: {
            identifier: fileId,
            url: req.body.content,
            userId: req.user!.userId,
          },
        });
        identifier = fileId;
      } else {
        const fileId = crypto.randomBytes(4).toString("hex");
        await prisma.text.create({
          data: {
            identifier: fileId,
            text: req.body.content,
            userId: req.user!.userId,
          },
        });
        identifier = fileId;
      }
    } else {
      res.status(400).json({
        message: "Invalid type of content returned",
      });
      return;
    }

    if (identifier) {
      res.status(200).json({
        identifier,
      });
      return;
    } else {
      res.status(500).json({
        message: "An unknown error occurred!",
      });
      return;
    }
  } catch (e) {
    next(e);
  }
}

async function getAllContent(req: Request, res: Response, next: NextFunction) {
  try {
    const urls = await prisma.link.findMany({
      where: {
        userId: req.user!.userId,
      },
    });
    const screenshots = await prisma.screenshot.findMany({
      where: {
        userId: req.user!.userId,
      },
    });
    const files = await prisma.file.findMany({
      where: {
        userId: req.user!.userId,
      },
    });
    const text = await prisma.text.findMany({
      where: {
        userId: req.user!.userId,
      },
    });

    res.status(200).json({
      urls,
      screenshots,
      files,
      text,
    });
    return;
  } catch (e) {
    next(e);
  }
}

async function getScreenshot(req: Request, res: Response, next: NextFunction) {
  try {
    const identifier = schemas.identifier.parse(req.params.id);
    const screenshot = await prisma.screenshot.findFirst({
      where: {
        identifier,
      },
    });

    if (!screenshot) {
      res.status(404).json({
        message: "Could not find screenshot",
      });
      return;
    }

    res.setHeader("Content-Type", screenshot.type);
    res.sendFile(
      path.join(
        process.env.DATA_PATH as string,
        "uploads",
        screenshot.identifier,
      ),
    );
    return;
  } catch (e) {
    next(e);
  }
}

async function getFile(req: Request, res: Response, next: NextFunction) {
  try {
    const identifier = schemas.identifier.parse(req.params.id);
    const file = await prisma.file.findFirst({
      where: {
        identifier,
      },
    });

    if (!file) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }

    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", "attachment");
    res.sendFile(
      path.join(process.env.DATA_PATH as string, "uploads", file.identifier),
    );
    return;
  } catch (e) {
    next(e);
  }
}

async function getTextContent(req: Request, res: Response, next: NextFunction) {
  try {
    const identifier = schemas.identifier.parse(req.params.id);
    const text = await prisma.text.findFirst({
      where: {
        identifier,
      },
    });

    if (!text) {
      res.status(404).json({
        message: "Dump not found",
      });
    }

    res.send(text?.text);
    return;
  } catch (e) {
    next(e);
  }
}

async function getLink(req: Request, res: Response, next: NextFunction) {
  try {
    const identifier = schemas.identifier.parse(req.params.id);
    const link = await prisma.link.findFirst({
      where: {
        identifier,
      },
    });

    if (!link) {
      res.status(404).json({
        message: "No link found",
      });
      return;
    }

    res.redirect(link.url);
    return;
  } catch (e) {
    next(e);
  }
}

export default {
  createContent,
  getAllContent,
  getScreenshot,
  getFile,
  getTextContent,
  getLink,
};
