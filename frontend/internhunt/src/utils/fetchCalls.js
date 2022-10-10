// Create a class to make creating calls to the database easier.
import { getApiRoot } from "./getApiRoot";
class FetchCalls {
  constructor(endpoint, method, token = null, body = null) {
    this.endpoint = endpoint;
    this.method = method;
    this.token = token;
    this.body = body;
  }

  async publicGet() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);

    return response;
  }
  async protectedGet() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
        // Authorization token will be here once all routes are protected...
      },
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);

    return response;
  }

  async protectedPost() {
    const options = {
      method: this.method,
      headers: {
        "Content-type": "application/json",
        // Once all routes are protected, authorization token will be here
      },
      body: JSON.stringify(this.body),
    };
    const response = await fetch(getApiRoot() + this.endpoint, options);
    return response;
  }
}

export default FetchCalls;
