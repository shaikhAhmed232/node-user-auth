import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnAuthorizedError } from "../errors";
import { asyncWrapper } from "../middleware";
import User, { authenticateUser } from "../models/User";
import { findUser } from "../queries/userQueries";

const signUpUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, confPassword, first_name, last_name } =
      req.body;
    const newUser = new User(
      username,
      password,
      confPassword,
      first_name,
      last_name
    );
    const error = await newUser.validate();
    if (error.errors.length) {
      next(error);
      return;
    }
    await newUser.save();
    return res.status(201).json({ message: "user created successful" });
  }
);

const loginUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (!username || !password) {
      const error = new UnAuthorizedError("Invalid username or password");
      next(error);
      return;
    }
    const user: {
      username: string;
      password: string;
      first_name: string;
      last_name: string;
    } | null = await findUser(username, true);
    if (!user) {
      const error = new UnAuthorizedError("Invalid username or password");
      next(error);
    }
    const jwt = await authenticateUser(req.body, user!.password);
    if (!jwt) {
      const error = new UnAuthorizedError("Invalid username or password");
      next(error);
      return;
    }
    return res.status(200).json({ token: jwt, username: user!.username });
  }
);

export { signUpUser, loginUser };
