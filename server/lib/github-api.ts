import fetch from "node-fetch";

export const getUserRepos = async (username: string) => {
  return fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      "Content-Type": "application/json+vnd.github.v3.raw",
    },
  }).then((response) => response.json());
};

export const getUser = async (username: string) => {
  return fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "Content-Type": "application/json+vnd.github.v3.raw",
    },
  }).then((response) => response.json());
};

export const getRepo = async (owner: string, repo: string) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      "Content-Type": "application/json+vnd.github.v3.raw",
    },
  }).then((response) => response.json());
};
