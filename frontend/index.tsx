// import { StrictMode } from 'react';
// TODO ПОСЛЕ ОТЛАДКИ ВКЛЮЧИТЬ StrictMode!
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, Link, RouterProvider } from "react-router-dom";

import { AppStoreProvider } from '@Store';
import { BasicLayout } from '@Commn/layout';
import * as Pages from "./pages";

const container = document.getElementById('main-node');

const router = createBrowserRouter([{
  element: <BasicLayout />,
  errorElement: <Pages.ErrorPage />,
  loader: async () => {
      // При дев-разработки тут будет происходить циклический редирект
      if (window.location.href.includes('login')) window.location.replace("/login");
      if (window.location.href.includes('register')) window.location.replace("/register");
      return null;
    },
  children: [
    { path: "/", element: <Pages.List /> }, // Props index and path="/" are similar
    { path: "/404", element: <Pages.ErrorPage isNoFound /> },
    { path: "/list", element: <Pages.List /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ],
}]);

// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
createRoot(container!).render(<AppStoreProvider><RouterProvider router={router} /></AppStoreProvider>);

/* ПОСЛЕ ОТЛАДКИ ВКЛЮЧИТЬ StrictMode!
createRoot(container!).render(
  <React.StrictMode>
    <AppStoreProvider>
      <RouterProvider router={router} />
    </AppStoreProvider>
  </React.StrictMode>,
)
*/
