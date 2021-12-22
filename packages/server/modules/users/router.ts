import express from 'express';
import { getUser } from '../../lib/github-api';

const router = express.Router();

router.get('/:username', (request, response, next) => {
  const { username } = request.params;
  
  return getUser(username)
    .then(repository => response.json(repository))
    .catch(next);
});

export default router;
