import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { AppStoreProvider } from '@Store';
import { BasicLayout } from '@Commn/layout';
import * as Pages from './pages';
import { Auth } from './auth/Auth';

import '@Commn/styles.scss';

const container = document.getElementById('main-node');

const router = createBrowserRouter([
  {
    element: <BasicLayout />,
    errorElement: <Pages.ErrorPage />,
    children: [
      { path: "/", element: <Pages.List /> }, // Props index and path="/" are similar
      { path: "/404", element: <Pages.ErrorPage isNoFound /> },
      { path: "/list", element: <Pages.List /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
  },
  { path: "/login", element: <Auth />, errorElement: <Pages.ErrorPage /> },
  { path: "/register", element: <Auth />, errorElement: <Pages.ErrorPage /> }
]);

// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
createRoot(container!).render(<AppStoreProvider><RouterProvider router={router} /></AppStoreProvider>);
