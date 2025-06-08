import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { CategoriesManager } from "./_components/categories-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethodsManager } from "./_components/payment-methods-manager";
import { ClientsManager } from "./_components/clients-manager";

export function Account() {
  const navigate = useNavigate();
  const { userAccount, isPending } = useAuth();

  if (!userAccount && !isPending) {
    navigate("/", { replace: true });
  }

  if (isPending || !userAccount) return <p>Loading...</p>;

  return (
    <div className="flex flex-col flex-1">
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              Account Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Organize your categories, manage clients, and track payment
              methods
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm">
            <Tabs defaultValue="categories" className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6">
                <TabsList className="h-12 bg-transparent p-0 space-x-8">
                  <TabsTrigger
                    value="categories"
                    className="bg-transparent border-0 border-b-2 data-[state=active]:shadow-none border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-0 pb-3 pt-3 font-medium text-gray-600 data-[state=active]:text-blue-600 dark:text-gray-400 dark:data-[state=active]:text-blue-400">
                    Categories
                  </TabsTrigger>
                  <TabsTrigger
                    value="clients"
                    className="bg-transparent border-0 border-b-2 data-[state=active]:shadow-none border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-0 pb-3 pt-3 font-medium text-gray-600 data-[state=active]:text-blue-600 dark:text-gray-400 dark:data-[state=active]:text-blue-400">
                    Clients
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment-methods"
                    className="bg-transparent border-0 border-b-2 data-[state=active]:shadow-none border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-0 pb-3 pt-3 font-medium text-gray-600 data-[state=active]:text-blue-600 dark:text-gray-400 dark:data-[state=active]:text-blue-400">
                    Payment Methods
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="categories" className="p-6 mt-0">
                <CategoriesManager />
              </TabsContent>

              <TabsContent value="clients" className="p-6 mt-0">
                <ClientsManager />
              </TabsContent>

              <TabsContent value="payment-methods" className="p-6 mt-0">
                <PaymentMethodsManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
