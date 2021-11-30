import express from 'express';
import { getRepo } from '../../lib/github-api';

const router = express.Router();
router.get('/:owner/:repo', (request, response, next) => {
  const { owner, repo } = request.params;
  
  return getRepo(owner, repo)
    .then(repository => response.json(repository))
    .catch(next);
});

export default router;