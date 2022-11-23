import { Request, Response, NextFunction } from "express";

const asyncWrapper = (callback:any) => {
  return async (req:Request, res:Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (err) {
      next(err);
      return;
    }
  };
};

export default asyncWrapper;
