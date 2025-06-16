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
  emoji: string;
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
  emoji: string;
};

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type Transaction = {
  id: string;
  title: string;
  amount: string;
  account_id: string;
  account_name: string;
  category_id: number;
  category_name: string;
  category_emoji: string;
  client_id: string | null;
  client_name: string | null;
  confirmed: number | null;
  created_at: string;
  date: string;
  description: string;
  is_scheduled: number;
  payment_method_id: number | null;
  payment_method_name: string | null;
  payment_method_emoji: string | null;
  recurrence: string;
  scheduled_date: string | null;
  type: CategoryTypes;
  user_id: string;
};

export interface AccountFinancialSummary {
  account_id: string;
  account_name: string;
  account_type: "bank" | "cash" | "digital" | "crypto";
  confirmed_expenses: string;
  confirmed_expenses_count: number;
  confirmed_income: string;
  confirmed_income_count: number;
  confirmed_net_balance: string;
  current_balance: string;
  pending_expenses: string;
  pending_expenses_count: number;
  pending_income: string;
  pending_income_count: number;
  pending_net_balance: string;
  projectedBalance: number;
  totalConfirmedTransactions: number;
  totalPendingTransactions: number;
  totalTransactions: number;
  total_expenses: string;
  total_income: string;
  total_net_balance: string;
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
  data: AccountFinancialSummary;
};

export type GetCategoriesBodyType = {
  type: CategoryTypes[];
};

export type GetCategoriesResponseType = {
  categories: Category[];
};

export type RegisterNewCategoryBodyType = {
  name: string;
  emoji: string;
  type: CategoryTypes;
};

export type RegisterNewCategoryResponseType = {
  message: string;
};

export type UpdateCategoryBodyType = {
  id: number;
  name: string;
  emoji: string;
  type: CategoryTypes;
};

export type UpdateCategoryResponseType = {
  message: string;
};

export type DeleteCategoryBodyType = {
  id: number;
};
export type DeleteCategoryResponseType = {
  message: string;
};

export type RegisterTransactionBodyType = {
  title: string;
  description?: string | undefined;
  type: CategoryTypes;
  amount: number;
  date: Date;
  is_scheduled: boolean;
  scheduled_date?: Date | undefined;
  confirmed: boolean | null;
  recurrence: RecurrenceType;
  category_id: number;
  client_id?: string | undefined;
  payment_method_id?: number | undefined;
};

export type RegisterTransactionResponseType = {
  message: string;
};

export type PaymentMethodBaseResponseType = {
  message: string;
};

export type PaymentMethodsResponseType = {
  paymentMethods: PaymentMethod[];
};

export type DeletePaymentMethodBodyType = {
  id: number;
};

export type UpdatePaymentMethodBodyType = {
  id: number;
  name: string;
};

export type CreatePaymentMethodBodyType = {
  name: string;
  emoji: string;
};

export type CreatePaymentMethodResponseType = {
  message: string;
};

export type ClientBaseResponseType = {
  message: string;
};

export type ListClientsResponseType = {
  clients: Client[];
};

export type RegisterClientBodyType = {
  name: string;
  email: string | null;
  phone: string | null;
};

export type UpdateClientBodyType = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export type DeleteClientBodyType = {
  id: string;
};

export interface ListPaginatedTransactionsParams {
  limit?: number;
  offset?: number;
  type?: string;
  is_scheduled?: boolean;
  confirmed?: boolean;
  recurrence?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  category_id?: number;
  account_id?: string;
  client_id?: string;
  payment_method_id?: number;
  search?: string;
  order_by?: string;
  order_direction?: "asc" | "desc";
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
  total_pages: number;
}

export interface TransactionsSummary {
  total_transactions: number;
  total_income: string;
  total_expense: string;
  balance: string;
  confirmed_count: number;
  pending_count: number;
  scheduled_count: number;
}

export interface ListPaginatedTransactionsResponse {
  data: Transaction[];
  pagination: PaginationInfo;
  summary: TransactionsSummary;
}

export interface TransactionResponseType {
  message: string;
}

export interface DeleteTransactionBodyType {
  transactionId: string;
}

export interface ConfirmScheduledTransactionBodyType {
  transactionId: string;
}

export interface FinancialSummaryResponseType {
  success: true;
  data: {
    user_info: {
      name: string;
      email: string;
    };
    period: {
      start: string;
      end: string;
    };
    totals: {
      total_income: number;
      total_expense: number;
      net_balance: number;
    };
    data: {
      year: number;
      months: {
        [month: number]: {
          month: number;
          month_name: number;
          days: {
            id: number;
            day: string;
            total_income: number;
            total_expense: number;
            net_balance: number;
            account_name: string;
            account_type: string;
          }[];
          month_totals: {
            income: number;
            expense: number;
            balance: number;
          };
        };
      };
      year_totals: {
        income: number;
        expense: number;
        balance: number;
      };
    }[];
    generated_at: string;
  };
}

export interface FinancialExportResponse {
  success: true;
  data: {
    user_info: {
      name: string;
      email: string;
    };
    period: {
      start: string;
      end: string;
    };
    totals: {
      total_income: number;
      total_expense: number;
      net_balance: number;
    };
    data: {
      year: number;
      months: {
        [month: number]: {
          month: number;
          month_name: number;
          days: {
            id: number;
            day: string;
            total_income: number;
            total_expense: number;
            net_balance: number;
            account_name: string;
            account_type: string;
          }[];
          month_totals: {
            income: number;
            expense: number;
            balance: number;
          };
        };
      };
      year_totals: {
        income: number;
        expense: number;
        balance: number;
      };
    }[];
    generated_at: string;
  };
  export_info: {
    generated_at: string;
    user_id: string;
    account_id: string;
  };
}

export type FinancialPeriod =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "current_month"
  | "last_month"
  | "current_year"
  | "last_year";

export type DailyEntry = {
  date: string;
  day: number;
  day_name: string;
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
  income_positive: number;
  expense_negative: number;
};

export type Summary = {
  total_income: number;
  total_expense: number;
  net_balance: number;
  period: {
    start: string;
    end: string;
  };
  averages: {
    daily_income: number;
    daily_expense: number;
    daily_balance: number;
  };
};

export type ChartConfig = {
  x_axis: string;
  y_axes: string[];
  colors: {
    income: string;
    expense: string;
    balance: string;
  };
};

export interface FinancialHistoryChartBodyType {
  period: FinancialPeriod;
}

export interface FinancialHistoryChartResponseType {
  success: boolean;
  period: FinancialPeriod;
  data: {
    data: DailyEntry[];
    summary: Summary;
    chart_config: ChartConfig;
  };
}

export type DailySummary = any;

export type MonthlySummary = {
  year: number;
  month: number;
  total_income: string;
  total_expense: string;
};

export type CategoryTotal = {
  category: string;
  total: string;
};

export type GlobalSummary = {
  total_income: string;
  total_expense: string;
  balance: string;
};

export interface GraphTransactionResponseType {
  graphData: {
    dailySummary: DailySummary[];
    monthlySummary: MonthlySummary[];
    categoryDistribution: {
      income: CategoryTotal[];
      expense: CategoryTotal[];
    };
    globalSummary: GlobalSummary;
  };
}
