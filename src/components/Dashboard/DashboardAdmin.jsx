import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
    GetAmountOfProject,
    GetAmountOfUser,
    GetAmountOfUserByRole,
    GetAmountProjectWithStatus
} from "../../services/DashboardApi";
import { Banner } from "../Banner/Banner";
import classes from "./DashboardAdmmin.module.css";
import classNames from "classnames/bind";
import dayjs from 'dayjs'; // 🟢 Import dayjs để xử lý ngày giờ
import 'dayjs/locale/vi'; // 🟢 Dùng tiếng Việt cho định dạng ngày
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'animate.css';

const cx = classNames.bind(classes);

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardAdmin = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [amountProject, setAmountProject] = useState(0);
    const [amountUser, setAmountUser] = useState(0);
    const [amountProjectWithStatus, setAmountProjectWithStatus] = useState([]);
    const [amountUserByRole, setAmountUserByRole] = useState([]);
    const [currentTime, setCurrentTime] = useState(dayjs().tz('Asia/Ho_Chi_Minh'));

    useEffect(() => {
        // 🕒 Cập nhật thời gian mỗi giây
        const interval = setInterval(() => {
            setCurrentTime(dayjs().tz('Asia/Ho_Chi_Minh'));
        }, 1000);

        return () => clearInterval(interval); // 🛑 Dọn dẹp interval khi component unmount
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchAmountOfProject();
        fetchAmountProjectWithStatus();
        fetchAmountOfUser();
        fetchAmountUserWithRole();
        setIsLoading(false);
    }, [user]);


    const fetchAmountOfProject = async () => {
        const response = await GetAmountOfProject(user.accountId);
        if (response.ok) {
            const responseData = await response.json();
            setAmountProject(responseData.result);
        } else {
            console.error("Error when getting amount of project");
        }
    };

    const fetchAmountOfUser = async () => {
        const response = await GetAmountOfUser();
        if (response.ok) {
            const responseData = await response.json();
            setAmountUser(responseData.result);
        } else {
            console.error("Error when getting amount of user");
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

    const fetchAmountUserWithRole = async () => {
        const response = await GetAmountOfUserByRole();
        if (response.ok) {
            const responseData = await response.json();
            setAmountUserByRole(responseData.result);
        } else {
            console.error("Error when getting amount of user by role");
        }
    };

    if (!user || isLoading) {
        return <Spinner />;
    }

    const chartDataAmountProject = {
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

    const chartDataAmountUserByRole = {
        labels: amountUserByRole.map(item => item.type),
        datasets: [{
            label: 'Số lượng dự án',
            data: amountUserByRole.map(item => item.amount),
            backgroundColor: [
                '#9966FF',   // Tím - Sinh viên
                '#36A2EB',  // Xanh dương - Giảng viên
                '#FFCE56',  // Vàng - Học viên
                '#4BC0C0',  // Xanh lục - Đối tác
            ],
            hoverOffset: 4
        }]
    };

    return (
        <div className={cx('dashboard-container')}>
            <div className={cx('greeting-container')}>
                <h2 className={cx('greeting', 'animate__animated animate__lightSpeedInRight')}>
                    <span className={cx('greeting-text')}>Xin chào, </span>
                    <span className={cx('greeting-role')}>administrator </span>
                    <span className={cx('greeting-name')}>{user?.fullName}</span> !
                </h2>

                {/* 📅 Hiển thị ngày giờ hiện tại */}
                <p className={cx('current-time', 'animate__animated animate__fadeIn')}>Hôm nay là {currentTime.format('dddd, DD/MM/YYYY HH:mm:ss')}</p>
            </div>
            <Banner/>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tổng số người dùng
                            </Typography>
                            <Typography variant="h4">{amountUser}</Typography>
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

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Người dùng
                            </Typography>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                height: "100%"
                            }}>
                                <Doughnut data={chartDataAmountUserByRole} options={{ maintainAspectRatio: false }} width={500} height={400} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
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
                                <Doughnut data={chartDataAmountProject} options={{ maintainAspectRatio: false }} width={500} height={400} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default DashboardAdmin;
