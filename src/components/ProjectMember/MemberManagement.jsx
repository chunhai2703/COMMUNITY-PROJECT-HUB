import { StudentList } from "./StudentList/StudentList";
import members from './MemberManagement.module.css';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../Spinner/Spinner";
import { useCallback, useEffect, useState } from "react";
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

    // Fetch project details
    const fetchProjectDetail = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const response = await loadProjectDetails(projectId);
            setProjectDetail(response);
        } catch (error) {
            console.error("Error loading project details:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectDetail();
    }, [fetchProjectDetail]);

    // Show spinner while loading
    if (!projectId || !projectDetail || isLoading) {
        return <Spinner />;
    }

    // Role-based navigation
    if (user.roleId !== 4 && !(user.roleId === 2 && user.accountId === projectDetail.projectManagerId)) {
        navigate("/");
        return null;
    }

    return (
        <div>
            <div className={cx('header')}>
                <p className={cx('project-title')}>
                    {projectDetail.title}
                    <span className={cx('project-status')}>{projectDetail.status}</span>
                </p>
            </div>
            <StudentList project={projectDetail} />
            <LecturerList project={projectDetail} />
        </div>
    );
};

export default MemberManagement;
