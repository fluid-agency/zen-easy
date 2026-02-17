import jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userId?: String, role?: string },
  secret: string,
) => {
  let token = jwt.sign(jwtPayload, secret, { expiresIn: '14d' });
  return `Bearer ${token}`;
};