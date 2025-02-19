import { StudentList } from "./StudentList/StudentList";
import members from './MemberManagement.module.css';
import classNames from 'classnames/bind';
import { useParams } from "react-router-dom";
import { Spinner } from "../Spinner/Spinner";
import { useEffect, useState } from "react";
import { loadProjectDetails } from "../../services/ProjectsApi";
import { LecturerList } from "./LecturerList/LecturerList";

const cx = classNames.bind(members);
const MemberManagement = () => {

    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [projectDetail, setProjectDetail] = useState(null);

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

    if (!projectId || !projectDetail) {
        return <Spinner />
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