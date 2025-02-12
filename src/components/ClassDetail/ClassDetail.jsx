import { CalendarToday, RecordVoiceOver } from "@mui/icons-material";
import style from "./ClassDetail.module.css"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useEffect, useState } from "react";
import LessonClass from "./LessonClass";
import TraineeList from "./TraineeList";
import EvaluateResult from "./EvaluateResult";
import { useParams } from "react-router-dom";
import { GetClassDetail } from "../../services/ClassApi";
import { Spinner } from "../Spinner/Spinner";
const ClassDetail = () => {
    const [activeTab, setActiveTab] = useState("lesson");
    const { classId } = useParams();
    const { projectId } = useParams();
    const [dataClass, setDataClass] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGetClassDetail = async () => {
        setIsLoading(true);
        const response = await GetClassDetail(classId)
        const responseData = await response.json();
        if (response.ok) {
            setDataClass(responseData.result);
        } else {
            console.error("Error fetching class detail");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (classId) {
            fetchGetClassDetail();
        }
    }, [classId])

    if (!dataClass) {
        return <Spinner />
    }

    return (
        <div>
            <div className={style.header}>
                <p className={style.classTitle}>Lớp</p>
                <p className={style.classcode}>{dataClass.classCode}</p>
                <p className={style.projectTitle}>{dataClass.projectTitle}</p>
            </div>
            <div style={{ margin: "0 20px" }}>
                <div className={style.infoContainer}>
                    <div className={style.infoHeader}>
                        <p><CalendarToday /> Thông tin chung</p>
                    </div>
                    <div className={style.info}>
                        <div className="flex mb-5">
                            <p className="mr-10 font-bold w-1/3"><RecordVoiceOver /> Giảng viên</p>
                            {dataClass.ClasslecturerName ? (
                                <p>
                                    {dataClass.ClasslecturerName}
                                </p>
                            ) : (
                                <p style={{ color: 'red' }}>
                                    Chưa có
                                </p>
                            )}

                        </div>
                        <div className="flex mb-5">
                            <p className="mr-10 font-bold w-1/3"><StarBorderIcon /> Sinh viên hỗ trợ</p>
                            <div>
                                {dataClass.getMemberOfClassDTOs.length > 0 ? (
                                    dataClass.getMemberOfClassDTOs.map((student) => (
                                        <p>
                                            {student.fullName}
                                        </p>
                                    ))

                                ) : (
                                    <p style={{ color: 'red' }}>
                                        Chưa có
                                    </p>
                                )}

                            </div>
                        </div>
                        <div className="flex mb-5">
                            <p className="mr-10 font-bold w-1/3"><StarBorderIcon /> Học viên</p>
                            <p>{dataClass.totalTrainee}</p>
                        </div>
                    </div>
                </div>
                <div className={style.tabContainer}>
                    <button
                        className={`${style.tab} ${activeTab === "lesson" ? style.active : ""}`}
                        onClick={() => setActiveTab("lesson")}
                    >Buổi học</button>
                    <button
                        className={`${style.tab} ${activeTab === "traineeList" ? style.active : ""}`}
                        onClick={() => setActiveTab("traineeList")}
                    >Danh sách học viên</button>
                    <button
                        className={`${style.tab} ${activeTab === "evaluateResult" ? style.active : ""}`}
                        onClick={() => setActiveTab("evaluateResult")}
                    >Đánh giá kết quả</button>
                </div>
                <div style={{ backgroundColor: "#474D57", padding: "10px 30px", color: "white" }}>
                    <p style={{ fontSize: 24 }}>{dataClass.projectTitle}</p>
                    <p style={{ fontSize: 14 }}>{dataClass.classCode}</p>
                </div>


                <div className={style.componentTab}>
                    {activeTab === "lesson" && <LessonClass projectId={projectId} classId={classId} />}
                    {activeTab === "traineeList" && <TraineeList />}
                    {activeTab === "evaluateResult" && <EvaluateResult />}
                </div>
            </div>
        </div>


    );
}


export default ClassDetail;