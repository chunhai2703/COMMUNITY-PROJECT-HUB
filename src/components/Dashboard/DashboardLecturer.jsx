import React, { useState, useEffect } from 'react';
import classes from './DashboardLecturer.module.css';
import classNames from 'classnames/bind';
import { Banner } from '../Banner/Banner';
import dayjs from 'dayjs'; // 🟢 Import dayjs để xử lý ngày giờ
import 'dayjs/locale/vi'; // 🟢 Dùng tiếng Việt cho định dạng ngày
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'animate.css';
import { Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';


const cx = classNames.bind(classes);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // Đặt ngôn ngữ mặc định là tiếng Việt

const items = [
  {
    key: '1',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Cần kỹ năng gì để tham gia vào dự án?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul>
        <li>Không cần phải có kỹ năng đặc biệt!</li>
        <li>Bạn có thể đóng góp theo sở trường của mình.</li>
        <li>Nếu bạn có kỹ năng về <span style={{ fontWeight: '600' }}>quản lý, truyền thông, thiết kế, lập trình</span>, dự án sẽ tận dụng tốt hơn sự giúp đỡ của bạn.</li>
      </ul>
    ),
  },
  {
    key: '2',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Nếu tham gia dự án, có cơ hội học hỏi điều gì không?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul>
        <li>✔️ Kỹ năng <span style={{ fontWeight: '600' }}>làm việc nhóm</span> và <b>giao tiếp</b> với nhiều người.</li>
        <li>✔️  Cách <span style={{ fontWeight: '600' }}>tổ chức và quản lý sự kiện</span>.</li>
        <li>✔️ <span style={{ fontWeight: '600' }}>Tư duy cộng đồng</span> và cách tạo ra tác động xã hội.</li>
        <li>✔️  <span style={{ fontWeight: '600' }}>Kết nối</span> với những người cùng chí hướng, mở rộng quan hệ.</li>
      </ul>
    ),
  },
  {
    key: '3',
    label: (
      <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>
        Nếu không có nhiều thời gian thì có cách nào để tham gia không?
      </span>
    ),
    style: { backgroundColor: '#474D57' },
    children: (
      <ul>
        <li>✅ <span style={{ fontWeight: '600' }}>Chia sẻ thông tin</span> trên mạng xã hội để giúp dự án tiếp cận nhiều người hơn.</li>
        <li>✅ <span style={{ fontWeight: '600' }}>Tham gia hỗ trợ từ xa</span>: viết nội dung, thiết kế, hoặc giúp đỡ về công nghệ.</li>
        <li>✅ <span style={{ fontWeight: '600' }}>Góp một khoản nhỏ vào quỹ</span> nếu dự án cần tài trợ.</li>
      </ul>
    ),
  },
];


export const DashboardLecturer = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().tz('Asia/Ho_Chi_Minh'));
  const { user } = useAuth();
  console.log(user);

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

  if (!user) return <Spinner />

  return (
    <div className={cx('dashboard-container')}>
      <div className={cx('greeting-container')}>
        <h2 className={cx('greeting', 'animate__animated animate__lightSpeedInRight')}>
          <span className={cx('greeting-text')}>Xin chào, </span>
          <span className={cx('greeting-role')}>{user?.roleId === 3
            ? 'học viên'
            : user?.roleId === 2
              ? 'giảng viên'
              : 'sinh viên'} </span>
          <span className={cx('greeting-name')}>{user?.fullName}</span> !
        </h2>

        {/* 📅 Hiển thị ngày giờ hiện tại */}
        <p className={cx('current-time', 'animate__animated animate__fadeIn')}>Hôm nay là {currentTime.format('dddd, DD/MM/YYYY HH:mm:ss')}</p>
      </div>

      <Banner />
      <div className={cx('collapse-container')}>
        <h2 className={cx('collapse-title')}>Những câu hỏi thường gặp</h2>
        <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} size='large' expandIcon={customExpandIcon} />
      </div>

    </div>
  );
};
