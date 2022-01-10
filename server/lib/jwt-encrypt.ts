import jwt from 'jsonwebtoken';

export const createJWT = (id: number, user: string) => {
  const userJwt = jwt.sign(
    {
      id,
      user,
    },
    process.env.JWT_KEY!
  );
  return userJwt;
};
