import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.mdrcindia.com",
  timeout: 50000,
  headers: {
    Accept: "application/json",
  },
});

/* TOKEN (future use) */
export const setToken = (token?: string) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

/* RESPONSE NORMALIZER */
const responseBody = (response: any) => response.data;

/* OBJECT → FORMDATA (CENTRAL PLACE) */
const toFormData = (body: Record<string, any>) => {
  const fd = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    fd.append(key, value as any);
  });
  return fd;
};

/* REQUEST WRAPPER */
const requests = {
  get: (url: string, config?: any) =>
    instance.get(url, config).then(responseBody),

  post: (url: string, body?: any) => {
    const payload =
      body instanceof FormData ? body : toFormData(body);

    return instance
      .post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(responseBody);
  },

  put: (url: string, body?: any) => {
    const payload =
      body instanceof FormData ? body : toFormData(body);

    return instance
      .put(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

export default requests;
