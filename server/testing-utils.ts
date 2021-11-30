

/* Start - Setup Global Fetch*/
import { default as fetch, Response, Request, Headers } from "node-fetch";


namespace NodeJS {
  interface Global {
    fetch: typeof fetch;
  }
}


// global.fetch = fetch;
// global.Request = Request;
// global.Response = Response;
// global.Headers = Headers;

/* End - Setup Global Fetch*/
