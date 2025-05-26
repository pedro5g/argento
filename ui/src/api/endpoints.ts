import type { UserProfileResponseType } from "./api-types";
import { httpClient } from "./axios";

export const ApiUserProfile = async () => {
  return await httpClient.GET<UserProfileResponseType>("/user/me");
};
