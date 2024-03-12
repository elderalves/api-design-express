import e from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createNewUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.create({
      data: {
        username,
        password: await hashPassword(password),
      },
    });

    // res.status(201);
    // res.json({ user });
    const token = createJWT(user);
    res.json({ token });

  } catch (error) {
    error.type = "input";
    next(error);
  }
}

export const signin = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    res.status(401);
    res.json({ message: "Invalid username" });
    return;
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    res.status(401);
    res.json({ message: "Invalid password" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
}