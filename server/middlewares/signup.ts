import { Request, Response, NextFunction } from 'express';
import { requestError } from './errorhandler';

const validation = (req: Request, res: Response, next: NextFunction) => {
  const { email, username, password } = req.body;
  const rfc_5322 =
    /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  const userValidation = /^(?=.{4,20}$)(?![_.])[a-zA-Z0-9._]+$/;
  const passValidation =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;

  email.toLowerCase();
  email.trim();
  username.trim();

  if (!rfc_5322.test(email)) {
    throw requestError('Invalid Email');
  }

  if (!userValidation.test(username)) {
    throw requestError('Invalid Username');
  }

  if (!passValidation.test(password)) {
    throw requestError('Invalid Password');
  }

  next();
};

export { validation };
