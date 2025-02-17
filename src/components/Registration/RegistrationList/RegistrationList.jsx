import React, { useState } from 'react'
import { Pagination, ConfigProvider, Result } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import classes from './RegistrationList.module.css'
import classNames from 'classnames/bind'
import { RegistrationItem } from '../RegistrationItem/RegistrationItem';


const cx = classNames.bind(classes)
const DUMMY_DATA = [
  {
    id: 1,
    projectName: '🎓 Thắp Sáng Tri Thức – Hành Trang Tương Lai',
    createdDate: '17/02/2025',
    description: 'Tôi là [Họ và tên], hiện đang [công việc/học tập tại đâu]. Tôi mong muốn được tham gia dự án vì [lý do cá nhân, đam mê, mong muốn đóng góp...]. Tôi có kinh nghiệm/kỹ năng về [kỹ năng liên quan như giao tiếp, tổ chức sự kiện, thiết kế, truyền thông...], và hy vọng có thể hỗ trợ dự án một cách tốt nhất. Tôi tin rằng sự nhiệt huyết và tinh thần trách nhiệm của mình sẽ góp phần vào sự thành công của dự án. Rất mong được đồng hành cùng mọi người!',
    status: 2
  },
  {
    id: 2,
    projectName: '💻 Thành thạo tin học văn phòng',
    createdDate: '20/02/2025',
    description: 'Tôi là [Họ và tên], hiện đang [công việc/học tập tại đâu]. Tôi mong muốn được tham gia dự án vì [lý do cá nhân, đam mê, mong muốn đóng góp...]. Tôi có kinh nghiệm/kỹ năng về [kỹ năng liên quan như giao tiếp, tổ chức sự kiện, thiết kế, truyền thông...], và hy vọng có thể hỗ trợ dự án một cách tốt nhất. Tôi tin rằng sự nhiệt huyết và tinh thần trách nhiệm của mình sẽ góp phần vào sự thành công của dự án. Rất mong được đồng hành cùng mọi người!',
    status: 1
  },
  {
    id: 3,
    projectName: ' 🌳 GreenFuture - Xanh cho tương lai',
    createdDate: '18/02/2025',
    description: 'Tôi là [Họ và tên], hiện đang [công việc/học tập tại đâu]. Tôi mong muốn được tham gia dự án vì [lý do cá nhân, đam mê, mong muốn đóng góp...]. Tôi có kinh nghiệm/kỹ năng về [kỹ năng liên quan như giao tiếp, tổ chức sự kiện, thiết kế, truyền thông...], và hy vọng có thể hỗ trợ dự án một cách tốt nhất. Tôi tin rằng sự nhiệt huyết và tinh thần trách nhiệm của mình sẽ góp phần vào sự thành công của dự án. Rất mong được đồng hành cùng mọi người!',
    status: 0
  },
  {
    id: 4,
    projectName: '🎉 Quyên góp cho người người nghèo',
    createdDate: '21/02/2025',
    description: 'Tôi là [Họ và tên], hiện đang [công việc/học tập tại đâu]. Tôi mong muốn được tham gia dự án vì [lý do cá nhân, đam mê, mong muốn đóng góp...]. Tôi có kinh nghiệm/kỹ năng về [kỹ năng liên quan như giao tiếp, tổ chức sự kiện, thiết kế, truyền thông...], và hy vọng có thể hỗ trợ dự án một cách tốt nhất. Tôi tin rằng sự nhiệt huyết và tinh thần trách nhiệm của mình sẽ góp phần vào sự thành công của dự án. Rất mong được đồng hành cùng mọi người!',
    status: 0
  }
]
const ITEMS_PER_PAGE = 3;

export const RegistrationList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRegistrations = DUMMY_DATA.slice(startIndex, endIndex);

  if (currentRegistrations.length === 0) {
    return (
      <div className={cx('registration-list-container')}>
        <div className={cx('registration-list')}>
          <ConfigProvider
            theme={{
              components: {
                Result: {
                  iconFontSize: '40px',
                  colorInfo: 'grey',
                },
              },
            }}
          >
            <Result
              title="Chưa có đơn đăng kí nào"
              icon={<DatabaseOutlined style={{ opacity: '0.5' }} />}
              style={{ color: 'grey', opacity: '0.5' }}
            />
          </ConfigProvider>

        </div>
      </div>
    )
  }

  return (
    <div className={cx('registration-list-container')}>
      <div className={cx('registration-list')}>
        {currentRegistrations.map((regis) => <RegistrationItem key={regis.id} {...regis} />)}
        <Pagination align="center" defaultCurrent={1} total={DUMMY_DATA.length} pageSize={ITEMS_PER_PAGE} onChange={(page) => setCurrentPage(page)} />
      </div>
    </div>

  )
}
