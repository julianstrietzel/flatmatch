import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

export interface DecodedToken extends JwtPayload {
  id: string;
}

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({
      error: "Unauthorized",
      message: "No auth token provided in the request",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).send({
        error: "Unauthorized",
        message: "Invalid auth token",
      });
    }

    const decodedToken = decoded as DecodedToken;

    req.body.userId = decodedToken.id;
    next();
  });
};

export default authCheck;

export function authCheckSocket(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token is missing"));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err || !decoded) {
        return next(new Error("Authentication error: Invalid token"));
      }

      const decodedToken = decoded as DecodedToken;
      socket.data.userId = decodedToken.id;
      next();
    }
  );
}
