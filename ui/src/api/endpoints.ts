import type {
  GetFinancialSummaryResponseType,
  ListUserAccountResponseType,
  LoginBodyType,
  LoginResponseType,
  RegisterAccountBodyType,
  RegisterAccountResponseType,
  RegisterBodyType,
  RegisterResponseType,
  SetCurrentAccountBodyType,
  SetCurrentAccountResponseType,
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

export const ApiSetCurrentAccount = async <
  B extends SetCurrentAccountBodyType
>({
  accountId,
}: B) => {
  return await httpClient.PATCH<SetCurrentAccountResponseType>(
    `/user/set-account/${accountId}`
  );
};

// Account routes
export const ApiListUserAccounts = async () => {
  return await httpClient.GET<ListUserAccountResponseType>("/account/list");
};

export const ApiRegisterAccount = async <B extends RegisterAccountBodyType>(
  body: B
) => {
  return await httpClient.POST<RegisterAccountResponseType, B>(
    "/account/register",
    body
  );
};

export const ApiGetFinancialSummary = async () => {
  return await httpClient.GET<GetFinancialSummaryResponseType>(
    "/account/financial-summary"
  );
};
