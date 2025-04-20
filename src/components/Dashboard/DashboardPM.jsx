import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
    GetAmountOfProject,
    GetAmountProjectWithStatus,
    GetProgressOfAllProject
} from "../../services/DashboardApi";
import classes from "./DashboardPM.module.css";
import classNames from "classnames/bind";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(classes);

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPM = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [amountProject, setAmountProject] = useState(0);
    const [amountProjectWithStatus, setAmountProjectWithStatus] = useState([]);
    const [progressProjectList, setProgressProjectList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        fetchAmountOfProject();
        fetchAmountProjectWithStatus();
        fetchProgressProjectList();
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

    return (
        <div className={cx("dashboard-container")}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tổng số dự án quản lý
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
                                        <div key={project.projectId} className="w-full" onClick={() => navigate(`/home-lecturer/project-detail/${project.projectId}`)}>
                                            <p className="text-lg md:text-xl mb-2 md:mb-3">{project.projectName}</p>
                                            <Progress
                                                percent={project.percentage}
                                                size={["100%", 20]} // Đảm bảo thanh progress co giãn theo màn hình 
                                                status={project.projectStatus === 'Kết thúc' ? 'success' : project.projectStatus === 'Hủy' ? 'exception' : 'active'}
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

export default DashboardPM;
