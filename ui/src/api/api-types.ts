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

export type UserProfileResponseType = {
  userAccount: UserAccount;
};
