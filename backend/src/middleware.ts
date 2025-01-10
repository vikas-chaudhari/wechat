import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.json({ ERROR: "No token found" });
      return;
    }
    const payload = await verifyToken(token);

    // @ts-ignore
    req.user = payload;
    next();
  } catch (err) {
    res.json({ ERROR: "invalid token" });
    return;
  }
};
