import { createBrowserRouter, RouterProvider } from "react-router";
import { BaseLayout } from "./layouts/base-layout";
import { AuthLayout } from "./layouts/auth-layout";
import { SignUp } from "./pages/publics/sign-up";
import { SignIn } from "./pages/publics/sign-in";
import { AppLayout } from "./layouts/app-layout";
import { Dashboard } from "./pages/protected/dashboard";
import { Account } from "./pages/protected/account";
import { Transactions } from "./pages/protected/transactions";
import { Analytics } from "./pages/protected/analytics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { path: "/", element: <SignIn /> },
          { path: "/sign-up", element: <SignUp /> },
        ],
      },
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/account", element: <Account /> },
          { path: "/transactions", element: <Transactions /> },
          { path: "/analytics", element: <Analytics /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
