import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/AuthPage/LoginPage";
import GuestAuth from "../guards/GuestGuard";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { LayoutDH } from "../layout/layout/LayoutDH";
import { HomeDH } from "../pages/HomePage/HomeDH";
import { ProjectsDH } from "../pages/ProjectsPage/ProjectsDH";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import { RelatedProjects } from "../pages/ProjectsPage/RelatedProjects";
import ViewProfilePage from "../pages/ViewProfilePage/ViewProfilePage";
import { LayoutAdmin } from "../layout/layout/LayoutAdmin";
import { HomeAdmin } from "../pages/HomePage/HomeAdmin";
import ChangePasswordPage from "../pages/ViewProfilePage/ChangePasswordPage";
import AccountManagementPage from "../pages/AccountManagementPage/AccountManagementPage";
import { ErrorPageDH } from "../pages/ErrorPage/ErrorPageDH";
import { ErrorPageAdmin } from "../pages/ErrorPage/ErrorPageAdmin";
import { ErrorPageLogin } from "../pages/ErrorPage/ErrorPageLogin";
import { Projectsloader as projectLoader, ProjectDetailsLoader as projectDetailLoader } from "../services/ProjectsApi";
import ClassDetailPage from "../pages/ClassDetailPage/ClassDetailPage";
import MaterialManagementPage from "../pages/MaterialManagementPage/MaterialManagementPage";
import MemberManagementPage from "../pages/MemberManagementPage/MemberManagementPage";
import { LayoutLecturer } from "../layout/layout/LayoutLecturer";
import { HomeLecturer } from "../pages/HomePage/HomeLecturer";
import { ErrorPageLecturer } from "../pages/ErrorPage/ErrorPageLecturer";
import { LayoutStudent } from "../layout/layout/LayoutStudent";
import { ErrorPageStudent } from "../pages/ErrorPage/ErrorPageStudent";
import { HomeStudent } from "../pages/HomePage/HomeStudent";
import { ProjectDetailPage } from "../pages/ProjectDetailPage/ProjectDetail";
import { AvailableProjects } from "../pages/ProjectsPage/AvailableProjects";
import { MyRegistrationPage } from "../pages/RegistrationPage/MyRegistrationPage";
import { ProjectRegistrationPage } from "../pages/RegistrationPage/ProjectRegistrationPage";
import { ChatLayout } from "../components/Chat/ChatLayout/ChatLayout";
import { ChatContent } from "../components/Chat/ChatContent/ChatContent";



export const router = createBrowserRouter([
  //Path for Guest
  {
    path: "/",
    element: <GuestAuth><LoginPage /></GuestAuth>,
    errorElement: <ErrorPageLogin />
  },


  //Path for Department Head
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
        loader: projectLoader,
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader
      },
      {
        path: "view-profile",
        element: <ViewProfilePage />,
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


  //Path for Lecturer
  {
    path: "/home-lecturer",
    element: <LayoutLecturer />,
    errorElement: <ErrorPageLecturer />,
    children: [
      {
        index: true,
        element: <HomeLecturer />
      },
      {
        path: "all-related-projects",
        element: <RelatedProjects />,
      },
      {
        path: "all-available-projects",
        element: <AvailableProjects />,
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader
      },
      {
        path: 'project-registration/:projectId',
        element: <ProjectRegistrationPage />
      },
      {
        path: "my-registration",
        element: <MyRegistrationPage />
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
        path: "chat",
        element: <ChatLayout />,
        errorElement: <ErrorPageLecturer />,
        children: [
          {
            index: true,
            element: <ChatContent />,
          },
          {
            path: ":classId",
            element: <ChatContent />,
          }
        ]
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
        element: <ErrorPageLecturer />
      },
    ]
  },

  //Path for Student
  {
    path: "/home-student",
    element: <LayoutStudent />,
    errorElement: <ErrorPageStudent />,
    children: [
      {
        index: true,
        element: <HomeStudent />
      },
      {
        path: "all-related-projects",
        element: <RelatedProjects />,
      },
      {
        path: "all-available-projects",
        element: <AvailableProjects />,
      },
      {
        path: "project-detail/:projectId",
        element: <ProjectDetailPage />,
        loader: projectDetailLoader
      },
      {
        path: "project-detail/:projectId/material",
        element: <MaterialManagementPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "my-registration",
        element: <MyRegistrationPage />
      },
      {
        path: "class-detail/:projectId/:classId",
        element: <ClassDetailPage />,
        errorElement: <ErrorPage />
      },
      {
        path: "chat",
        element: <ChatLayout />,
        errorElement: <ErrorPageStudent />,
        children: [
          {
            index: true,
            element: <ChatContent />,
          },
          {
            path: ":classId",
            element: <ChatContent />,
          }
        ]
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
        element: <ErrorPageStudent />
      },
    ]
  },


  //Path for Admin
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


  //Path for forgot password
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />
  },
]);

