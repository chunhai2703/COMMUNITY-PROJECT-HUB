import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/AuthPage/LoginPage";
import GuestAuth from "../guards/GuestGuard";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { LayoutDH } from "../layout/layout/LayoutDH";
import { HomeDH } from "../pages/HomePage/HomeDH";
import { ProjectsDH } from "../pages/ProjectsPage/ProjectsDH";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import { LayoutPM } from "../layout/layout/LayoutPM";
import { HomePM } from "../pages/HomePage/HomePM";
import { ProjectsPM } from "../pages/ProjectsPage/ProjectsPM";
import ViewProfilePage from "../pages/ViewProfilePage/ViewProfilePage";
import { LayoutAdmin } from "../layout/layout/LayoutAdmin";
import { HomeAdmin } from "../pages/HomePage/HomeAdmin";
import ChangePasswordPage from "../pages/ViewProfilePage/ChangePasswordPage";
import AccountManagementPage from "../pages/AccountManagementPage/AccountManagementPage";
import { ProjectDetailDH } from "../pages/ProjectDetailPage/ProjectDetailDH";
import { ErrorPageDH } from "../pages/ErrorPage/ErrorPageDH";
import { ErrorPagePM } from "../pages/ErrorPage/ErrorPagePM";
import { ErrorPageAdmin } from "../pages/ErrorPage/ErrorPageAdmin";
import { ErrorPageLogin } from "../pages/ErrorPage/ErrorPageLogin";
import { Projectsloader as projectLoader, ProjectDetailsLoader as projectDetailLoader } from "../services/ProjectsApi";
import ClassDetailPage from "../pages/ClassDetailPage/ClassDetailPage";
import MaterialManagementPage from "../pages/MaterialManagementPage/MaterialManagementPage";
import MemberManagementPage from "../pages/MemberManagementPage/MemberManagementPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <ErrorPageLogin />
  },
  {
    path: "/home-department-head",
    element: <LayoutDH />,
    errorElement: <ErrorPageDH />,
    children: [
      {
        index: true,
        element: <HomeDH />
      },
      {
        path: "projects",
        element: <ProjectsDH />,
        loader: projectLoader

      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailDH />,
        loader: projectDetailLoader
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "project-detail/:projectId/member-list",
        element: <MemberManagementPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định trong 
        element: <ErrorPageDH />,
        errorElement: <ErrorPage />
      }
    ]
  },
  {
    path: "/home-project-manager",
    element: <LayoutPM />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePM />
      },
      {
        path: "projects",
        element: <ProjectsPM />
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
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPagePM />
      },
      {
        path: "class-detail",
        element: <ClassDetailPage />,
        errorElement: <ErrorPage />
      },
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
    errorElement: <ErrorPageAdmin />,
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
      },
      {
        path: "*", // Bắt tất cả các đường dẫn không xác định 
        element: <ErrorPageAdmin />
      }
    ]
  },
]);

