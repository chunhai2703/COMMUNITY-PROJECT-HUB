import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/AuthPage/LoginPage";
import GuestAuth from "../guards/GuestGuard";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { LayoutDH } from "../layout/layout/LayoutDH";
import { HomeDH } from "../pages/HomePage/HomeDH";
import { Projects } from "../pages/ProjectsPage/Projects";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import ViewProfilePage from "../pages/ViewProfilePage/ViewProfilePage";
import { LayoutAdmin } from "../layout/layout/LayoutAdmin";
import { HomeAdmin } from "../pages/HomePage/HomeAdmin";
import ChangePasswordPage from "../pages/ViewProfilePage/ChangePasswordPage";
import AccountManagementPage from "../pages/AccountManagementPage/AccountManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <ErrorPage />
  },
  {
    path: "/home-department-head",
    element: <LayoutDH />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomeDH />
      },
      {
        path: "projects",
        element: <Projects />
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPage />
      }
    ]
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/home-admin",
    element: <LayoutAdmin />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomeAdmin />
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "account-management",
        element: <AccountManagementPage />,
        errorElement: <ErrorPage />
      }
    ]
  },
]);

