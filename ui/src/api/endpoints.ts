import type {
  ClientBaseResponseType,
  CreatePaymentMethodBodyType,
  CreatePaymentMethodResponseType,
  DeleteCategoryBodyType,
  DeleteCategoryResponseType,
  DeleteClientBodyType,
  DeletePaymentMethodBodyType,
  GetCategoriesBodyType,
  GetCategoriesResponseType,
  GetFinancialSummaryResponseType,
  ListClientsResponseType,
  ListUserAccountResponseType,
  LoginBodyType,
  LoginResponseType,
  PaymentMethodBaseResponseType,
  PaymentMethodsResponseType,
  RegisterAccountBodyType,
  RegisterAccountResponseType,
  RegisterBodyType,
  RegisterClientBodyType,
  RegisterNewCategoryBodyType,
  RegisterResponseType,
  RegisterTransactionBodyType,
  RegisterTransactionResponseType,
  SetCurrentAccountBodyType,
  SetCurrentAccountResponseType,
  UpdateCategoryBodyType,
  UpdateClientBodyType,
  UpdatePaymentMethodBodyType,
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

export const ApiUpdateCategory = async <T extends UpdateCategoryBodyType>({
  id,
  ...body
}: T) => {
  return await httpClient.PATCH<DeleteCategoryResponseType, typeof body>(
    `/category/${id}`,
    body
  );
};

export const ApiDeleteCategory = async <T extends DeleteCategoryBodyType>({
  id,
}: T) => {
  return await httpClient.DELETE(`/category/${id}`);
};

export const ApiGetCategories = async <T extends GetCategoriesBodyType>({
  type,
}: T) => {
  return await httpClient.GET<GetCategoriesResponseType>(
    `/category/list?type=${type.join(",")}`
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

export const ApiCreatePaymentMethod = async <
  T extends CreatePaymentMethodBodyType
>(
  body: T
) => {
  return await httpClient.POST<CreatePaymentMethodResponseType, T>(
    "/payment-method/create",
    body
  );
};

export const ApiUpdatePaymentMethod = async <
  T extends UpdatePaymentMethodBodyType
>({
  id,
  ...body
}: T) => {
  return await httpClient.PATCH<PaymentMethodBaseResponseType, typeof body>(
    `/payment-method/${id}`,
    body
  );
};

export const ApiDeletePaymentMethod = async <
  T extends DeletePaymentMethodBodyType
>({
  id,
}: T) => {
  return await httpClient.DELETE<PaymentMethodBaseResponseType>(
    `/payment-method/${id}`
  );
};

export const ApiListPaymentMethods = async () => {
  return await httpClient.GET<PaymentMethodsResponseType>(
    "/payment-method/list"
  );
};

export const ApiRegisterClient = async <T extends RegisterClientBodyType>(
  body: T
) => {
  return await httpClient.POST<ClientBaseResponseType, T>(
    "/client/create",
    body
  );
};

export const ApiUpdateClient = async <T extends UpdateClientBodyType>({
  id,
  ...body
}: T) => {
  return await httpClient.PATCH<ClientBaseResponseType, typeof body>(
    `/client/update/${id}`,
    body
  );
};

export const ApiDeleteClient = async <T extends DeleteClientBodyType>({
  id,
}: T) => {
  return await httpClient.DELETE<ClientBaseResponseType>(
    `/client/delete/${id}`
  );
};

export const ApiListClients = async () => {
  return await httpClient.GET<ListClientsResponseType>("/client/list");
};
