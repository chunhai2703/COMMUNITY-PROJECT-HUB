import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  GetAmountOfLecturer,
  GetAmountOfProject,
  GetAmountOfStudent,
  GetAmountOfTrainee,
  GetAmountProjectWithStatus,
  GetProgressOfAllProject,
} from "../../services/DashboardApi";
import { Banner } from "../Banner/Banner";
import classes from "./DashboardBR.module.css";
import classNames from "classnames/bind";
import dayjs from "dayjs"; // 🟢 Import dayjs để xử lý ngày giờ
import "dayjs/locale/vi"; // 🟢 Dùng tiếng Việt cho định dạng ngày
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "animate.css";
import { Progress } from "antd";
import { FolderFilled, InboxOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(classes);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi"); // Đặt ngôn ngữ mặc định là tiếng Việt

export const DashboardBR = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [amountLecturer, setAmountLecturer] = useState(0);
  const [amountStudent, setAmountStudent] = useState(0);
  const [amountTrainee, setAmountTrainee] = useState(0);
  const [amountProject, setAmountProject] = useState(0);
  const [amountProjectWithStatus, setAmountProjectWithStatus] = useState([]);
  const [currentTime, setCurrentTime] = useState(
    dayjs().tz("Asia/Ho_Chi_Minh")
  );
  const [progressProjectList, setProgressProjectList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🕒 Cập nhật thời gian mỗi giây
    const interval = setInterval(() => {
      setCurrentTime(dayjs().tz("Asia/Ho_Chi_Minh"));
    }, 1000);

    return () => clearInterval(interval); // 🛑 Dọn dẹp interval khi component unmount
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchAmountOfLecturer();
      fetchAmountOfStudent();
      fetchAmountOfTrainee();
      fetchAmountOfProject();
      fetchAmountProjectWithStatus();
      fetchProgressProjectList();
      setIsLoading(false);
    }
  }, [user]);

  const fetchAmountOfLecturer = async () => {
    const response = await GetAmountOfLecturer();
    if (response.ok) {
      const responseData = await response.json();
      setAmountLecturer(responseData.result);
    } else {
      console.error("Error when getting amount of lecturer");
    }
  };

  const fetchAmountOfStudent = async () => {
    const response = await GetAmountOfStudent();
    if (response.ok) {
      const responseData = await response.json();
      setAmountStudent(responseData.result);
    } else {
      console.error("Error when getting amount of student");
    }
  };

  const fetchAmountOfTrainee = async () => {
    const response = await GetAmountOfTrainee(user.accountId);
    if (response.ok) {
      const responseData = await response.json();
      setAmountTrainee(responseData.result);
    } else {
      console.error("Error when getting amount of trainee");
    }
  };

  const fetchAmountOfProject = async () => {
    const response = await GetAmountOfProject(user.accountId);
    if (response.ok) {
      const responseData = await response.json();
      setAmountProject(responseData.result);
    } else {
      console.error("Error when getting amount of project");
    }
  };

  const fetchAmountProjectWithStatus = async () => {
    const response = await GetAmountProjectWithStatus(user.accountId);
    if (response.ok) {
      const responseData = await response.json();
      setAmountProjectWithStatus(responseData.result);
    } else {
      console.error("Error when getting amount of project with status");
    }
  };

  const fetchProgressProjectList = async () => {
    const response = await GetProgressOfAllProject(user.accountId);
    if (response.ok) {
      const responseData = await response.json();
      setProgressProjectList(responseData.result);
    } else {
      console.error("Error when getting progress of project");
    }
  };

  if (!user || isLoading) {
    return <Spinner />;
  }

  const chartData = {
    labels: amountProjectWithStatus.map((item) => item.type),
    datasets: [
      {
        label: "Số lượng dự án",
        data: amountProjectWithStatus.map((item) => item.amount),
        backgroundColor: [
          "#9966FF", // Tím - Lên kế hoạch
          "#36A2EB", // Xanh dương - Sắp diễn ra
          "#FFCE56", // Vàng - Đang diễn ra
          "#4BC0C0", // Xanh lục - Kết thúc
          "#FF6384", // Đỏ - Hủy
        ],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div className={cx("dashboard-container")}>
      <div className={cx("greeting-container")}>
        <h2
          className={cx(
            "greeting",
            "animate__animated animate__lightSpeedInRight"
          )}
        >
          <span className={cx("greeting-text")}>
            Xin chào, Phòng quan hệ doanh nghiệp{" "}
          </span>
          <span className={cx("greeting-name")}>{user?.fullName}</span> !
        </h2>

        {/* 📅 Hiển thị ngày giờ hiện tại */}
        <p className={cx("current-time", "animate__animated animate__fadeIn")}>
          Hôm nay là {currentTime.format("dddd, DD/MM/YYYY HH:mm:ss")}
        </p>
      </div>
      <Banner />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            className={cx("shortcut-card")}
            onClick={() => navigate("/home-business-relation/projects")}
          >
            <CardContent>
              <p className={cx("shortcut-title")}>
                {" "}
                <FolderFilled
                  style={{
                    fontSize: "24px",
                    color: "#60B5FF",
                    marginRight: "10px",
                  }}
                />
                Dự Án
              </p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            className={cx("shortcut-card")}
            onClick={() =>
              navigate("/home-business-relation/feedback-management")
            }
          >
            <CardContent>
              <p className={cx("shortcut-title")}>
                {" "}
                <InboxOutlined
                  style={{
                    fontSize: "24px",
                    color: "#FF9B17",
                    marginRight: "10px",
                  }}
                />
                Quản lý câu hỏi
              </p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng số giảng viên
              </Typography>
              <Typography variant="h4">{amountLecturer}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng số sinh viên tham gia hỗ trợ
              </Typography>
              <Typography variant="h4">{amountStudent}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng số học viên
              </Typography>
              <Typography variant="h4">{amountTrainee}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng số dự án
              </Typography>
              <Typography variant="h4">{amountProject}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng thái dự án
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Doughnut
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                  width={500}
                  height={400}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tiến độ dự án
              </Typography>
              <div className="mt-6 flex flex-col gap-6 md:gap-8">
                {progressProjectList &&
                  progressProjectList.map((project) => (
                    <div
                      key={project.projectId}
                      className="w-full"
                      onClick={() =>
                        navigate(
                          `/home-business-relation/project-detail/${project.projectId}`
                        )
                      }
                    >
                      <p className="text-lg md:text-xl mb-2 md:mb-3">
                        {project.projectName}
                      </p>
                      <Progress
                        percent={
                          project.projectStatus === "Hủy"
                            ? 100
                            : project.percentage
                        }
                        size={["100%", 20]} // Đảm bảo thanh progress co giãn theo màn hình
                        status={
                          project.projectStatus === "Kết thúc"
                            ? "success"
                            : project.projectStatus === "Hủy"
                              ? "exception"
                              : "active"
                        }
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
