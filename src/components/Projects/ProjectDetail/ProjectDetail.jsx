import React, { useState } from 'react'
import { EllipsisOutlined, ExportOutlined, FileTextOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd';
import classes from './ProjectDetail.module.css'
import classNames from 'classnames/bind'
import { ProjectInformation } from './ProjectInformation/ProjectInformation';
import { ProjectLesson } from './ProjectLesson/ProjectLesson';
import { ProjectClass } from './ProjectClass/ProjectClass';
import { ProjectUnactiveForm } from '../../Popup/Project/ProjectUnactiveForm';
import { ProjectUpdateForm } from '../../Popup/Project/ProjectUpdateForm';
import useAuth from '../../../hooks/useAuth';
import { Spinner } from '../../Spinner/Spinner';
import { ProjectChangeStatus } from '../../Popup/Project/ProjectChangeStatus';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ExportFinalReportProject } from '../../../services/ProjectsApi';


const cx = classNames.bind(classes)
export const ProjectDetail = (props) => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log(user);

  const moveToProjectLog = () => {
    if (user && (user?.roleId === 2)) {
      navigate(`/home-lecturer/project-detail/${projectId}/project-log`);
    } else if (user && (user?.roleId === 4)) {
      navigate(`/home-department-head/project-detail/${projectId}/project-log`);
    }
  }

  const handleExportFinalReport = async () => {
    setIsLoading(true);
    const response = await ExportFinalReportProject(projectId);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FinalReport.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Export dữ liệu thành công")
    } else {
      toast.error("Export dữ liệu thất bại")
    }
    setIsLoading(false)
  }
  const items = [
    {
      key: '1',
      label: <ProjectUpdateForm project={props.project} />,
    },
    {
      key: '2',
      label: (
        <button className={cx('project-detail-backlog')} onClick={moveToProjectLog}>
          <FileTextOutlined style={{ marginRight: '8px' }} /> Xem log
        </button>
      ),
    },
    ...(props.project.status === 'Lên kế hoạch'
      ? [
        {
          key: '3',
          label: <ProjectChangeStatus />,
        },
      ]
      : []),
    ...(props.project.status === 'Lên kế hoạch' || props.project.status === 'Sắp diễn ra'
      ? [
        {
          key: '4',
          label: <ProjectUnactiveForm />,
        },
      ]
      : []),
    ...((props.project.status === 'Đang diễn ra' || props.project.status === 'Kết thúc')
      && (
        user.roleId === 4
        || user.roleId === 5
        || user.roleId === 6
        || (user.roleId === 2 && user.accountId === props.project.projectManagerId)
      )
      ? [
        {
          key: '5',
          label: (
            <button className={cx('project-detail-export-final-report')} onClick={handleExportFinalReport}>
              <ExportOutlined style={{ marginRight: '8px' }} /> Export báo cáo dự án
            </button>
          ),
        },
      ]
      : []),
  ].filter(Boolean);


  if (!user || isLoading) {
    return <Spinner />;
  }

  return (
    <div className={cx('project-detail-container')}>
      <header className={cx('project-detail-header')}>
        <p className={cx('project-detail-title')}>Chi tiết dự án</p>
        <div className={cx('project-detail-name-container')}>
          <div className={cx('project-detail-name')}>
            <h2 className={cx('project-detail-name-title')}>{props.project.title}</h2>
            <span className={cx('project-detail-name-status')}>{props.project.status}</span>
          </div>
          {user && (user.roleId === 4 || user.accountId === props.project.projectManagerId) ? (
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              disabled={!props.project.status}
            >
              <EllipsisOutlined style={{ fontSize: "36px", color: "white" }} />
            </Dropdown>
          ) : null}


        </div>
      </header>
      <ProjectInformation project={props.project} />
      <ProjectLesson project={props.project} />
      <ProjectClass project={props.project} />
    </div>
  )
}
