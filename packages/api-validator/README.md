# API Request & Response Runtime Validation

Runtime data validation of HTTP requests.

_For those who put too much trust in TypeScript_ ✨

## Examples

### Path based validation

```ts
import fetchValidationFactory from './fetchValidationFactory';

// `fetch-validated.ts`
export const paths = {
  `/api/user`: checkUserSchema,
  `/api/repos/`: checkRepoSchema,
  `GET:/api/notes`: data => schema_id_and_note.parse(data),
  `POST:/api/notes`: {
    request: (data) => schema_note.parse(data),
    response: (data) => schema_id_and_note.parse(data),
  }
};

const fetchValidated = fetchValidationFactory(paths);
export default fetchValidated;
```




### Zod Schema Validation

```ts
import { z } from "zod";

export default function checkUserSchema(input: unknown) {
  return GitUserSchema.parse(input);
}

const GitUserSchema = z.object({
  login: z.string().required(),
  id: z.number().required(),
  nodeId: z.string().required(),
  avatarUrl: z.string().required(),
  gravatarId: z.string().required(),
  url: z.string().required(),
  htmlUrl: z.string().required(),
  followersUrl: z.string().required(),
  followingUrl: z.string().required(),
  gistsUrl: z.string().required(),
  starredUrl: z.string().required(),
  subscriptionsUrl: z.string().required(),
  organizationsUrl: z.string().required(),
  reposUrl: z.string().required(),
  eventsUrl: z.string().required(),
  receivedEventsUrl: z.string().required(),
  type: z.string().required(),
  siteAdmin: z.boolean().required(),
  name: z.string().required(),
  company: z.string().required(),
  blog: z.string().required(),
  location: z.string().required(),
  email: z.string().email().required(),
  hireable: z.boolean().required(),
  bio: z.string().required(),
  twitterUsername: z.string().required(),
  publicRepos: z.number().required(),
  publicGists: z.number().required(),
  followers: z.number().required(),
  following: z.number().required(),
  createdAt: z.date().required(),
  updatedAt: z.date().required()
});
export type GitUser = z.infer<typeof GitUserSchema>;

```
