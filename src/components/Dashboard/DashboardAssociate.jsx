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
import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { Line } from "rc-progress";


const cx = classNames.bind(classes);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // Đặt ngôn ngữ mặc định là tiếng Việt

const items = [
  {
    key: '1',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Vai trò của giảng viên trong dự án là gì?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Hướng dẫn</span> và <span style={{ fontWeight: 600 }}>định hướng chuyên môn</span> cho sinh viên trong dự án.</li>
        <li>Đóng góp ý kiến để <span style={{ fontWeight: 600 }}>cải thiện quy trình</span> và <span style={{ fontWeight: 600 }}>chất lượng</span> của dự án.</li>
        <li><span style={{ fontWeight: 600 }}>Kết nối</span> dự án với các <span style={{ fontWeight: 600 }}>tổ chức</span>, <span style={{ fontWeight: 600 }}>doanh nghiệp</span> hoặc <span style={{ fontWeight: 600 }}>các nguồn tài trợ</span> phù hợp.</li>
      </ul>
    ),
  },
  {
    key: '2',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Giảng viên có thể hỗ trợ học viên như thế nào?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Hướng dẫn</span> học viên về <span style={{ fontWeight: 600 }}>chuyên môn</span>, <span style={{ fontWeight: 600 }}>kỹ thuật</span>, và các <span style={{ fontWeight: 600 }}>kỹ năng cần thiết</span>.</li>
        <li><span style={{ fontWeight: 600 }}>Định hướng chiến lược</span> để giúp dự án phát triển bền vững.</li>
        <li><span style={{ fontWeight: 600 }}>Hỗ trợ học viên</span> trong việc <span style={{ fontWeight: 600 }}>trình bày</span> và <span style={{ fontWeight: 600 }}>báo cáo kết quả</span> dự án.</li>
        <li><span style={{ fontWeight: 600 }}>Đánh giá</span> và <span style={{ fontWeight: 600 }}>phản hồi</span> để giúp học viên <span style={{ fontWeight: 600 }}>cải thiện chất lượng</span> công việc.</li>
      </ul>
    ),
  },
  {
    key: '3',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Nếu giảng viên không có nhiều thời gian, có thể tham gia bằng cách nào?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Hỗ trợ từ xa</span> bằng cách <span style={{ fontWeight: 600 }}>tư vấn chuyên môn</span> qua <span style={{ fontWeight: 600 }}>email</span> hoặc <span style={{ fontWeight: 600 }}>cuộc họp trực tuyến</span>.</li>
        <li>Tham gia trong các giai đoạn quan trọng như <span style={{ fontWeight: 600 }}>đánh giá kế hoạch</span>, <span style={{ fontWeight: 600 }}>kiểm tra tiến độ</span>.</li>
        <li><span style={{ fontWeight: 600 }}>Giới thiệu học viên</span> đến các <span style={{ fontWeight: 600 }}>chuyên gia</span> hoặc <span style={{ fontWeight: 600 }}>nguồn lực hữu ích</span> cho dự án.</li>
      </ul>
    ),
  },
  {
    key: '4',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Dự án có mang lại lợi ích gì cho giảng viên không?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1rem', fontSize: '16px' }}>
        <li><span style={{ fontWeight: 600 }}>Mở rộng cơ hội hợp tác</span> với các <span style={{ fontWeight: 600 }}>tổ chức</span>, <span style={{ fontWeight: 600 }}>doanh nghiệp</span> và <span style={{ fontWeight: 600 }}>cộng đồng</span>.</li>
        <li><span style={{ fontWeight: 600 }}>Góp phần nâng cao chất lượng giảng dạy</span> thông qua thực tiễn.</li>
        <li>Được công nhận là <span style={{ fontWeight: 600 }}>người hướng dẫn</span>, <span style={{ fontWeight: 600 }}>cố vấn</span> trong các dự án có tác động xã hội.</li>
        <li><span style={{ fontWeight: 600 }}>Cơ hội tham gia</span> vào các <span style={{ fontWeight: 600 }}>nghiên cứu</span> hoặc <span style={{ fontWeight: 600 }}>xuất bản bài báo</span> liên quan đến dự án.</li>
      </ul>
    ),
  },
];


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

  const onChange = (key) => {
    console.log(key);
  };
  const customExpandIcon = ({ isActive }) => (
    <DownOutlined style={{ color: 'white', fonWWeight: '600', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
  );

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
              <div className="mt-6">
                {progressProjectList && progressProjectList.map((project) => (
                  <div>
                    <p className="text-xl mb-3" >{project.projectName} - {project.percentage} %</p>
                    <Line percent={project.percentage} strokeWidth={1} strokeColor="#4CAF50" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div className={cx('collapse-container')}>
        <h2 className={cx('collapse-title')}>Những câu hỏi thường gặp <QuestionCircleOutlined /></h2>
        <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} size='large' expandIcon={customExpandIcon} />
      </div>

    </div>
  );
};
