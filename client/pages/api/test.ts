import { getUserRequest } from '../../api/requests';

export default async function handler(req, res) {
  const gg = await getUserRequest();
  console.log('req', req.headers);
  res.status(200).json({ gg });
}
