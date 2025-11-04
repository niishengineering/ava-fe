import axios, { AxiosError } from "axios";
import { getUserRefreshToken, getUserToken } from "../utilities";
import Cookies from "js-cookie";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const ssoUrl = process.env.NEXT_PUBLIC_BACKEND_SSO_URL;

interface getSupportAgentsParams {
  siteId: string;
}

export async function registerUser(data: any) {
  try {
    const response = await axios.post(`${ssoUrl}/auth/register`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${ssoUrl}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
export async function logOutUser() {
  try {
    Cookies.remove("refreshToken");
    Cookies.remove("token");

    // const response = await axios.post(`${ssoUrl}/auth/login`);
    // return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function createNewUserProperty(data: any) {
  const token = getUserToken();
  try {
    const response = await axios.post(
      `${backendUrl}/property-chat/create-property`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getUserInfo() {
  try {
    const token = getUserToken();
    const response = await axios.get(`${backendUrl}/users/get-user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getSupportAgents(params: getSupportAgentsParams) {
  try {
    const token = getUserToken();
    if (!token) return;
    const response = await axios.get(`${backendUrl}/users/get-support-agents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getAllSupportAgents(
  siteId: string,
  page = 1,
  searchTerm: string,
  limit: number
) {
  const token = getUserToken();
  if (!token) return;

  try {
    const response = await axios.get(
      `${backendUrl}/users/get-all-support-agents/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          searchTerm,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
}

(async function refreshTokon() {
  async function run() {
    const refreshToken = getUserRefreshToken();
    try {
      const refreshToken = getUserRefreshToken();
      const response = await axios.post(
        `${ssoUrl}/auth/refresh`,
        {}, // request body (empty object if none)
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      console.log({ response });
      Cookies.set("token", response.data.token.accessToken, {
        expires: 30,
        secure: true,
      });

      Cookies.set("refreshToken", response.data.token.refreshToken, {
        expires: 30,
        secure: true,
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      if (error instanceof AxiosError) {
        console.error(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }

  // Run immediately
  await run();

  // Run every 15 minutes (900,000 ms)
  setInterval(run, 3 * 60 * 1000);
})();
