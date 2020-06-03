import { Auth } from "src/app/models";

export const initialState: Auth & { isLoading?: boolean; error?: any } = {
  tokenType: "",
  accessToken: "",
  refreshToken: "",
  expiresIn: "",
  isLoading: false,
  error: null,
};
