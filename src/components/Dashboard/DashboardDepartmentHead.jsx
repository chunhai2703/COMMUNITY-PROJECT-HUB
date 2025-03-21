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
    GetAmountProjectWithStatus
} from "../../services/DashboardApi";

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardDepartmentHead = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [amountLecturer, setAmountLecturer] = useState(0);
    const [amountStudent, setAmountStudent] = useState(0);
    const [amountTrainee, setAmountTrainee] = useState(0);
    const [amountProject, setAmountProject] = useState(0);
    const [amountProjectWithStatus, setAmountProjectWithStatus] = useState([]);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchAmountOfLecturer();
            fetchAmountOfStudent();
            fetchAmountOfTrainee();
            fetchAmountOfProject();
            fetchAmountProjectWithStatus();
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
        <div className="p-4">
            <Grid container spacing={3}>
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

                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Trạng thái dự án
                            </Typography>
                            <Doughnut data={chartData} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default DashboardDepartmentHead;
