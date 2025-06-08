import { TransactionsTable } from "./_components/table";

export function Transactions() {
  return (
    <div className="flex flex-col flex-1">
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Views all transactions
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <TransactionsTable />
        </div>
      </main>
    </div>
  );
}
