import { z } from "zod";
import { esModuleify } from "./utils/esModuleify";

import { mockFetchResponse } from "./utils/mockFetchResponse";
import fetchFactory from "./validateFetchFactory";

export const schema_note = z.object({
  note: z.string().min(1).max(50),
});

export const schema_id_and_note = z.object({
  id: z.number().min(1),
  note: z.string().min(1).max(50),
});

describe("fetchFactory (Minimal/Fixture Mocks)", () => {
  describe("response body validation", () => {
    it("should silently handle good response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock(
        "node-fetch",
        esModuleify(mockFetchResponse({ body: { note: `Dan` } }))
      );
      // jest.mock("node-fetch", () => mockFetchResponse({body: { note: `Dan` }}));

      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory((data) => schema_note.parse(data));

      return fetchValidator(`https://api.github.com/users/justsml`)
        .then((response) => {
          // console.log(response);
          return response.json();
        })
        .then((body) => {
          expect(body).toEqual({ note: "Dan" });
        });
    });
    it("should throw on invalid response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock(
        "node-fetch",
        esModuleify(mockFetchResponse({ body: { id: 1 } }))
      );
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory((data) => {
        // console.log('schema_note.validate:', data);
        return schema_id_and_note.parse(data)
      });

      expect.assertions(1);
      return fetchValidator(`https://example.local/notes`)
        .then((response) => response.json())
        // .then((body) => {
        //   // console.log(".then, oh noes", { body });
        //   // expect(body).toEqual({ note: "Dan" });
        // })
        .catch((error) => expect(error).toBeInstanceOf(Error));
    });
  });

  describe("request body validation", () => {
    it("should throw on invalid POST response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock(
        "node-fetch",
        esModuleify(mockFetchResponse({ body: { id: 42, user: `Dan` } }))
      );
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory({
        response: (data) => {
          // console.log("pre-validate", data);
          return schema_id_and_note.parse(data);
        },
      });

      expect.assertions(1);
      return fetchValidator(`https://example.local/notes`, {
        method: "POST",
        body: JSON.stringify({ note: "Dan" }),
      })
        .then((response) => response.json())
        .catch((error) => expect(error).toBeInstanceOf(Error));
    });
    it("should throw on invalid response", () => {
      // Use jest to override node-fetch with a super fake implementation.
      jest.mock(
        "node-fetch",
        esModuleify(mockFetchResponse({ body: { id: 1 } }))
      );
      // Create a fetch wrapper that will validate the response.
      const fetchValidator = fetchFactory((data) => schema_note.parse(data));

      return fetchValidator(`https://example.local/notes`)
        .then((response) => response.json())
        .catch((error) => expect(error).toBeInstanceOf(Error));
    });
  });
});
