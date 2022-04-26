let authHeader = {};

const getAuthHeader = () => {
  return authHeader;
};

// called by login service
const setToken = (token: string) => {
  if (!token) {
    authHeader = {};
  } else {
    authHeader = { headers: { Authorization: `bearer ${token}` } };
  }
};

export default { getAuthHeader, setToken };
