import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  GetAmountOfProject,
  GetAmountOfTrainee,
  GetAmountProjectWithStatus,
  GetProgressOfAllProject
} from "../../services/DashboardApi";
import { Banner } from "../Banner/Banner";
import classes from "./DashboardAssociate.module.css";
import classNames from "classnames/bind";
import dayjs from 'dayjs'; // 🟢 Import dayjs để xử lý ngày giờ
import 'dayjs/locale/vi'; // 🟢 Dùng tiếng Việt cho định dạng ngày
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'animate.css';
import { Progress } from "antd";


const cx = classNames.bind(classes);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // Đặt ngôn ngữ mặc định là tiếng Việt



export const DashboardAssociate = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().tz('Asia/Ho_Chi_Minh'));
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [amountTrainee, setAmountTrainee] = useState(0);
  const [amountProject, setAmountProject] = useState(0);
  const [amountProjectWithStatus, setAmountProjectWithStatus] = useState([]);
  const [progressProjectList, setProgressProjectList] = useState([]);

  useEffect(() => {
    // 🕒 Cập nhật thời gian mỗi giây
    const interval = setInterval(() => {
      setCurrentTime(dayjs().tz('Asia/Ho_Chi_Minh'));
    }, 1000);

    return () => clearInterval(interval); // 🛑 Dọn dẹp interval khi component unmount
  }, []);



  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchAmountOfTrainee();
      fetchAmountOfProject();
      fetchAmountProjectWithStatus();
      fetchProgressProjectList();
      setIsLoading(false);
    }
  }, [user]);

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

  const chartData = {
    labels: amountProjectWithStatus.map(item => item.type),
    datasets: [{
      label: 'Số lượng dự án',
      data: amountProjectWithStatus.map(item => item.amount),
      backgroundColor: [
        '#9966FF',   // Tím - Lên kế hoạch
        '#36A2EB',  // Xanh dương - Sắp diễn ra
        '#FFCE56',  // Vàng - Đang diễn ra
        '#4BC0C0',  // Xanh lục - Kết thúc
        '#FF6384',  // Đỏ - Hủy

      ],
      hoverOffset: 4
    }]
  };

  if (!user) return <Spinner />

  return (
    <div className={cx('dashboard-container')}>
      <div className={cx('greeting-container')}>
        <h2 className={cx('greeting', 'animate__animated animate__lightSpeedInRight')}>
          <span className={cx('greeting-text')}>Xin chào, </span>
          <span className={cx('greeting-role')}>bên đối tác </span>
          <span className={cx('greeting-name')}>{user?.fullName}</span> !
        </h2>

        {/* 📅 Hiển thị ngày giờ hiện tại */}
        <p className={cx('current-time', 'animate__animated animate__fadeIn')}>Hôm nay là {currentTime.format('dddd, DD/MM/YYYY HH:mm:ss')}</p>
      </div>
      <Banner />
      <Grid container spacing={3}>
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
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%"
              }}>
                <Doughnut data={chartData} options={{ maintainAspectRatio: false }} width={500} height={400} />
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
                    <div key={project.id} className="w-full">
                      <p className="text-lg md:text-xl mb-2 md:mb-3">{project.projectName}</p>
                      <Progress
                        percent={project.percentage}
                        size={["100%", 20]} // Đảm bảo thanh progress co giãn theo màn hình 
                        status={project.projectStatus === 'Hoàn thành' ? 'success' : project.projectStatus === 'Hủy' ? 'exception' : 'active'}
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
