import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { createTaskLoader } from "../lib/dataloader/createTaskLoader";

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
  taskLoader: ReturnType<typeof createTaskLoader>;
};
