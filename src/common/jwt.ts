import jwt from "jsonwebtoken";

export const signToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
}