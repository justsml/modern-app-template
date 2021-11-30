import fetch from "node-fetch";

export const getUserRepos = async (username: string) => {
  return fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      "Accept": "application/json+vnd.github.v3.raw",
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const getUser = async (username: string): Promise<GitHubUser> => {
  return fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "Accept": "application/json+vnd.github.v3.raw",
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const getRepo = async (
  owner: string,
  repo: string
): Promise<unknown> => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      "Accept": "application/json+vnd.github.v3.raw",
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
};

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}
