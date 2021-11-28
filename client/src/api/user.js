import API from ".";

export const getUserList = () => API.get("/user");
export const getUserByUsername = (username) =>
  API.get(`/user/username/${username}`);
