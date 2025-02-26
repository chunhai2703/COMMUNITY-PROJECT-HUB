import { StudentList } from "./StudentList/StudentList";
import members from './MemberManagement.module.css';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../Spinner/Spinner";
import { useEffect, useState } from "react";
import { loadProjectDetails } from "../../services/ProjectsApi";
import { LecturerList } from "./LecturerList/LecturerList";
import useAuth from "../../hooks/useAuth";

const cx = classNames.bind(members);
const MemberManagement = () => {

    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [projectDetail, setProjectDetail] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchProjectDetail = async () => {
        if (projectId) {
            setIsLoading(true);
            const response = await loadProjectDetails(projectId);
            setProjectDetail(response);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(projectId) {
            fetchProjectDetail(projectId)
        }
    }, [projectId])

    if (!projectId || !projectDetail || isLoading) {
        return <Spinner />
    }

    if(!user.roleId === 4 && !(user.roleId === 3 && user.accountId === projectDetail.projectManagerId)) {
        navigate("/")
    }

    return (
        <div>
            <div className={cx('header')}>
                <p className={cx('project-title')}>{projectDetail.title}</p>
            </div>
            <StudentList />
            <LecturerList />
        </div>
    );
}

export default MemberManagement