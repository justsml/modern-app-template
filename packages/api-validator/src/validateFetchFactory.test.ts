import { z } from "zod";
import { esmWrapper } from "./utils/esmWrapper";

import { mockFetch } from "./utils/mockFetch";
import fetchFactory from "./validateFetchFactory";

export const schema_note = z.object({
  note: z.string().min(1).max(50),
});

export const schema_id_and_note = z.object({
  id: z.number().min(1),
  note: z.string().min(1).max(50),
});

describe("validateFetchFactory", () => {
  it("can handle valid response", () => {
    jest.mock("node-fetch", esmWrapper(mockFetch({ body: { note: `Dan` } })));

    const fetchValidator = fetchFactory((data) => schema_note.parse(data));

    expect.assertions(1);
    return fetchValidator(`https://api.github.com/users/justsml`)
      .then((response) => response.json())
      .then((body) => {
        expect(body).toEqual({ note: "Dan" });
      });
  });
  it("can throw on invalid response", () => {
    jest.mock("node-fetch", esmWrapper(mockFetch({ body: { id: 1 } })));
    const fetchValidator = fetchFactory((data) => schema_id_and_note.parse(data));

    expect.assertions(1);
    return fetchValidator(`https://example.local/notes`)
      .then((response) => response.json())
      .catch((error) => expect(error).toBeInstanceOf(Error));
  });

  it("can throw on invalid request body", () => {
    jest.mock("node-fetch", esmWrapper(mockFetch({ body: { user: 1 } })));
    const fetchValidator = fetchFactory({
      response: (data) => schema_id_and_note.parse(data),
    });

    expect.assertions(1);
    return fetchValidator(`https://example.local/notes`, {
      method: "PUT",
      body: JSON.stringify({ note: "Dan" }),
    })
      .then((response) => response.json())
      .catch((error) => expect(error).toBeInstanceOf(Error));
  });

  it("can validate request and response", () => {
    jest.mock(
      "node-fetch",
      esmWrapper(mockFetch({ body: { id: 42, note: `Dan` } }))
    );
    const fetchValidator = fetchFactory({
      response: (data) => schema_id_and_note.parse(data),
      request: (data) => schema_note.parse(data),
    });

    expect.assertions(1);
    return fetchValidator(`https://example.local/notes`, {
      method: "POST",
      body: JSON.stringify({ note: "Dan" }),
    })
      .then((response) => response.json())
      .then((response) => {
        expect(response).toEqual({ id: 42, note: "Dan" });
      });
  });

  it("can validate valid request payload", () => {
    jest.mock("node-fetch", esmWrapper(mockFetch({ body: { id: 1 } })));
    const fetchValidator = fetchFactory({
      request: (data) => schema_note.parse(data),
    });

    expect.assertions(1);
    return fetchValidator(`https://example.local/notes`, {
      method: "POST",
      body: JSON.stringify({ note: "Dan" }),
    })
      .then((response) => response.json())
      .then((data) => expect(data.id).toEqual(1));
  });
});
