import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const createJWT = (user) => {
  const token = jwt.sign({id: user.id, username: user.username }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  return token;
}

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: 'Unauthorized' });
    // res.send("Unauthorized");
    return;
  }

  const [, token] = bearer.split(' ');

  if(!token) {
    res.status(401);
    res.json({ message: 'not a valid token' });
    return;
  }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
    }
}

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 5);
}

export const comparePasswords = async (password, hash) => {
  return bcrypt.compare(password, hash);
}