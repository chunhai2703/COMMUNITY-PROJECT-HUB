import { CalendarToday, RecordVoiceOver } from "@mui/icons-material";
import style from "./ClassDetail.module.css"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useState } from "react";
import LessonClass from "./LessonClass";
import TraineeList from "./TraineeList";
import EvaluateResult from "./EvaluateResult";
const ClassDetail = () => {
    const [activeTab, setActiveTab] = useState("lesson");

    return (
        <div>
            <div className={style.header}>
                <p className={style.classTitle}>Lớp</p>
                <p className={style.classcode}>SE1715</p>
                <p className={style.projectTitle}>Cách sử dụng AI</p>
            </div>
            <div className={style.infoContainer}>
                <div className={style.infoHeader}>
                    <p><CalendarToday /> Thông tin chung</p>
                </div>
                <div className={style.info}>
                    <div className="flex mb-5">
                        <p className="mr-10 font-bold w-1/3"><RecordVoiceOver /> Giảng viên</p>
                        <p> HoaDNT</p>
                    </div>
                    <div className="flex mb-5">
                        <p className="mr-10 font-bold w-1/3"><StarBorderIcon /> Sinh viên hỗ trợ</p>
                        <div>
                            <p>PhucNM1</p>
                            <p>PhucNM2</p>
                            <p>PhucNM3</p>
                            <p>PhucNM4</p>
                        </div>
                    </div>
                    <div className="flex mb-5">
                        <p className="mr-10 font-bold w-1/3"><StarBorderIcon /> Học viên</p>
                        <p>25</p>
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
            <div style={{ backgroundColor: "#474D57", padding: "10px 30px", color: "white"}}>
                <p style={{ fontSize: 24}}>Cách sử dụng AI trong giảng dạy</p>
                <p style={{ fontSize: 14}}>SE1715</p>
            </div>


            <div className={style.componentTab}>
                {activeTab === "lesson" && <LessonClass />}
                {activeTab === "traineeList" && <TraineeList />}
                {activeTab === "evaluateResult" && <EvaluateResult />}
            </div>
        </div>


    );
}


export default ClassDetail;