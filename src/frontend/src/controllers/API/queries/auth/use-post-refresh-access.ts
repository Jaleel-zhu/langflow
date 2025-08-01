import { Cookies } from "react-cookie";
import { IS_AUTO_LOGIN, LANGFLOW_REFRESH_TOKEN } from "@/constants/constants";
import useAuthStore from "@/stores/authStore";
import type { useMutationFunctionType } from "@/types/api";
import { setAuthCookie } from "@/utils/utils";
import { api } from "../../api";
import { getURL } from "../../helpers/constants";
import { UseRequestProcessor } from "../../services/request-processor";

interface IRefreshAccessToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const useRefreshAccessToken: useMutationFunctionType<
  undefined,
  undefined | void,
  IRefreshAccessToken
> = (options?) => {
  const { mutate } = UseRequestProcessor();
  const autoLogin = useAuthStore((state) => state.autoLogin);

  async function refreshAccess(): Promise<IRefreshAccessToken> {
    const res = await api.post<IRefreshAccessToken>(`${getURL("REFRESH")}`);
    const cookies = new Cookies();
    setAuthCookie(cookies, LANGFLOW_REFRESH_TOKEN, res.data.refresh_token);

    return res.data;
  }

  const mutation = mutate(["useRefreshAccessToken"], refreshAccess, {
    ...options,
    retry: IS_AUTO_LOGIN || autoLogin ? 0 : 2,
  });

  return mutation;
};
