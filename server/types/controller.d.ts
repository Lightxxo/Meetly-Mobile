import { Request, Response } from "express";

declare type ControllerType = {
  [key: string]: (req: Request, res: Response) => Promise<void>;
};
