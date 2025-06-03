import type {
  GetCategoriesBodyType,
  GetCategoriesResponseType,
  GetFinancialSummaryResponseType,
  ListUserAccountResponseType,
  LoginBodyType,
  LoginResponseType,
  RegisterAccountBodyType,
  RegisterAccountResponseType,
  RegisterBodyType,
  RegisterNewCategoryBodyType,
  RegisterResponseType,
  RegisterTransactionBodyType,
  RegisterTransactionResponseType,
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

// Category routes

export const ApiRegisterNewCategory = async <
  T extends RegisterNewCategoryBodyType
>(
  body: T
) => {
  return await httpClient.POST("/category/create", body);
};

export const ApiGetCategories = async <T extends GetCategoriesBodyType>({
  type,
}: T) => {
  return await httpClient.GET<GetCategoriesResponseType>(
    `/category/list?type=${type}`
  );
};

export const ApiRegisterTransaction = async <
  T extends RegisterTransactionBodyType
>(
  body: T
) => {
  return await httpClient.POST<RegisterTransactionResponseType, T>(
    "/transactions/create",
    body
  );
};
