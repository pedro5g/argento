import type {
  LoginBodyType,
  LoginResponseType,
  RegisterBodyType,
  RegisterResponseType,
  UserProfileResponseType,
} from "./api-types";
import { httpClient } from "./axios";

// Auth routes
export const ApiRegister = async <B extends RegisterBodyType>(body: B) => {
  return await httpClient.POST<RegisterResponseType, B>("/auth/register", body);
};

export const ApiLogin = async <B extends LoginBodyType>(body: B) => {
  return await httpClient.POST<LoginResponseType, B>("/auth/login", body);
};

// User routes
export const ApiUserProfile = async () => {
  return await httpClient.GET<UserProfileResponseType>("/user/me");
};
