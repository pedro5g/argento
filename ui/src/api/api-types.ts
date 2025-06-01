export type CategoryTypes = "expense" | "income";
export type AccountType = "bank" | "cash" | "digital" | "crypto";
export type User = {
  id: string;
  name: string;
  email: string;
  // createdAt: Date | string
};

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
};

export type UserAccount = {
  user: User;
  account: Account;
};

export type Category = {
  id: number;
  name: string;
  type: CategoryTypes;
};

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export type PaymentMethod = {
  id: number;
  name: string;
};

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type Transaction = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  date: string;
  type: CategoryTypes;
  isScheduled: boolean;
  scheduledDate: string | null;
  confirmed: boolean | null;
  recurrence: RecurrenceType;
  account_id: string;
  category_id: number;
  client_id: string | null;
  payment_method_id: number | null;
  user_id: string | null;
  created_at: string | Date;
};

export interface AccountFinancialSummary {
  accountId: string;
  accountName: string;
  accountType: "bank" | "cash" | "digital" | "crypto";
  currentBalance: number;

  confirmedIncome: number;
  pendingIncome: number;
  totalIncome: number;

  confirmedExpenses: number;
  pendingExpenses: number;
  totalExpenses: number;

  confirmedNetBalance: number;
  pendingNetBalance: number;
  totalNetBalance: number;
  projectedBalance: number;

  confirmedIncomeCount: number;
  confirmedExpensesCount: number;
  pendingIncomeCount: number;
  pendingExpensesCount: number;
  totalTransactions: number;
  totalConfirmedTransactions: number;
  totalPendingTransactions: number;
}

export interface AccountPeriodSummary {
  accountId: string;
  accountName: string;
  accountType: "bank" | "cash" | "digital" | "crypto";
  currentBalance: number;
  periodConfirmedIncome: number;
  periodConfirmedExpenses: number;
  periodPendingIncome: number;
  periodPendingExpenses: number;
  periodTotalIncome: number;
  periodTotalExpenses: number;
  periodConfirmedNet: number;
  periodPendingNet: number;
  periodTotalNet: number;
  periodIncomeCount: number;
  periodExpenseCount: number;
  periodConfirmedCount: number;
  periodPendingCount: number;
  periodTotalTransactions: number;
}

export interface PeriodSummaryResponse {
  data: AccountPeriodSummary | null;
}

export type ApiError = {
  response: {
    data: {
      error: string;
    };
  };
};

export type UserProfileResponseType = {
  userAccount: UserAccount;
};

export type RegisterBodyType = {
  name: string;
  email: string;
  password: string;
};
export type RegisterResponseType = {
  message: string;
};

export type LoginBodyType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  token: string;
};

export type ListUserAccountResponseType = {
  accounts: Account[];
};

export type RegisterAccountBodyType = {
  name: string;
  type: AccountType;
  balance: number;
};

export type RegisterAccountResponseType = {
  message: string;
};

export type SetCurrentAccountBodyType = {
  accountId: string;
};

export type SetCurrentAccountResponseType = {
  message: string;
};

export type GetFinancialSummaryResponseType = {
  data: AccountFinancialSummary | null;
};
