import { getApiRoot } from "./getApiRoot";

export const isAuth = async () => {
  var response = {};
  response.ok = false;

  try {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      return response;
    }
    const userDataJson = JSON.parse(userData);
    const token = userDataJson.token;
    if (!token) {
      return response;
    }
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchRes = await fetch(getApiRoot() + "/users/isAuthorized", options);

    return fetchRes;
  } catch (err) {
    return response;
  }
};

