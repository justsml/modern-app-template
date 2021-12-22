/** @jest-environment setup-polly-jest/jest-environment-node */
import autoSetupPolly from "../utils/auto-setup-polly";
import { getUser, getRepo, getUserRepos } from "./github-api";

let pollyContext = autoSetupPolly();

test("getUser: custom interceptor", async () => {
  expect.assertions(1);
  pollyContext.polly.server
    .get("https://api.github.com/users/failing_request_trigger")
    .intercept((req, res) => void res.sendStatus(500));

  await expect(getUser("failing_request_trigger")).rejects.toThrow(
    "Http Error: 500"
  );
});

test("getUser", async () => {
  const user = await getUser("justsml");
  expect(typeof user).toBe("object");
  expect(user?.login).toBe("justsml");
});

test("getRepo", async () => {
  const repo = await getRepo("justsml", "dans-blog");
  expect(typeof repo).toBe("object");
  expect((repo as any)?.name).toBe("dans-blog");
  expect((repo as any)?.owner?.login).toBe("justsml");
});

test("getUserRepos", async () => {
  const repos = await getUserRepos("justsml");
  expect(typeof repos).toBe("object");
  expect(repos.length).toBeGreaterThanOrEqual(10);
});

test("getRepo: facebook/jest", async () => {
  const repo: any = await getRepo("facebook", "jest");

  expect(typeof repo).toBe("object");
  expect(repo?.full_name).toBe("facebook/jest");
  expect(repo?.name).toBe("jest");
  expect(repo?.owner?.login).toBe("facebook");
});
