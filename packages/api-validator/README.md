# Api Request & Response Runtime Validation

_For those who put too much trust in TypeScript_ ✨

## TODO

- [ ] Add support for path mapping input.
- [ ] Add logging override (to send to DD, Sentry, etc.)

```ts

export const paths = {
  `/api/user`: checkUserSchema,
  `/api/repos/`: repoSchema,
  `/api/notes`: {
    post: {
      request: (data) => schema_note.parse(data),
      response: (data) => schema_id_and_note.parse(data),
    },
    get: data => schema_id_and_note.parse(data)
  }
}

const fetchSafe = validatedFetchFactory(paths)

import { z } from "zod";

export default function checkUserSchema(input: unknown) {
  return GitUserSchema.
}

export const GitUserSchema = z.object({
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
