import { z } from "zod";

import { mockFetchResponse } from "./utils/mockFetchResponse";
import fetchFactory from "./validateFetchFactory";

export const RequestBodySchema = z.object({
  note: z.string().min(1).max(50),
});

export const ResponseSchema = z.object({
  id: z.number().min(1),
  note: z.string().min(1).max(50),
});

describe("fetchFactory (Minimal/Fixture Mocks)", () => {
  describe("response payload validation", () => {
    it("should silently handle good response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock("node-fetch", () => mockFetchResponse({ user: `Dan` }));
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory(data => RequestBodySchema.parse(data));

      return fetchValidator(`https://example.local/notes`)
        .then((response) => response.json())
        .then((body) => {
          expect(body).toEqual({ note: "Dan" });
        });
    });
    it("should throw on invalid response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock("node-fetch", () => mockFetchResponse({ id: 1 }));
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory(data => RequestBodySchema.parse(data));

      return expect(() =>
        fetchValidator(`https://example.local/notes`)
          .then((response) => response.json())
          .then((body) => {
            expect(body).toEqual({ note: "Dan" });
          })
      ).toThrowError(/Invalid/);
    });
  });

  describe("request body validation", () => {
    it("should allow valid POST", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock("node-fetch", () => mockFetchResponse({ id: 42, user: `Dan` }));
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory({ request: data => ResponseSchema.parse(data) });

      return fetchValidator(`https://example.local/notes`, {
        body: JSON.stringify({ note: "Dan" }),
      })
        .then((response) => response.json())
        .then((body) => {
          expect(body).toEqual({ note: "Dan" });
        });
    });
    it("should throw on invalid response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock("node-fetch", () => mockFetchResponse({ id: 1 }));
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory(data => RequestBodySchema.parse(data));

      return expect(() =>
        fetchValidator(`https://example.local/notes`)
          .then((response) => response.json())
          .then((body) => {
            expect(body).toEqual({ note: "Dan" });
          })
      ).toThrowError(/Invalid/);
    });
  });
});
