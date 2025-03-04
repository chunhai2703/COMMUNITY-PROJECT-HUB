import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import style from "./LessonClass.module.css";
import { Spinner } from "../Spinner/Spinner";
import { Button, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { GetAllLessonClassOfClass, UpdateLessonClass } from "../../services/ClassApi";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const LessonClass = ({ projectId, classId, dataClass }) => {
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: { lessons: [] }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lessonClassList, setLessonClassList] = useState([]);
    const { user } = useAuth();

    const formatOnlyDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const formatOnlyTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const fetchLessonClassList = async () => {
        setIsLoading(true);
        const response = await GetAllLessonClassOfClass(classId);
        const responseData = await response.json();
        if (response.ok) {
            setLessonClassList(responseData.result);
            reset({ lessons: responseData.result });
        } else {
            console.error("Error fetching lesson classes");
        }

        setIsLoading(false);

    };

    useEffect(() => {
        if (classId) {
            fetchLessonClassList();
        }
    }, [classId]);

    useEffect(() => {
        if (lessonClassList.length > 0) {
            lessonClassList.forEach((lesson, index) => {
                setValue(`lessons[${index}].startTime`, lesson.startTime?.slice(11, 16) || "");
                setValue(`lessons[${index}].endTime`, lesson.endTime?.slice(11, 16) || "");
                setValue(`lessons[${index}].date`, lesson.startTime ? lesson.startTime.slice(0, 10) : "");
                setValue(`lessons[${index}].room`, lesson.room || "");
            });
        }
    }, [lessonClassList, setValue]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = async (updatedData) => {
        setIsLoading(true);
        const formattedLessons = updatedData.lessons.map((lesson) => ({
            lessonClassId: lesson.lessonClassId,
            room: lesson.room,
            startTime: `${lesson.date}T${lesson.startTime}`,
            endTime: `${lesson.date}T${lesson.endTime}`,
        }))

        const response = await UpdateLessonClass(projectId, formattedLessons)
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Cập nhật thông tin buổi học thành công")
            fetchLessonClassList();
            setIsEditing(false);
        } else {
            toast.error(responseData.message)
        }
        setIsLoading(false);
    };


    if (isLoading || !user) {
        return <Spinner />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {((user.roleId === 4 && dataClass.projectStatus === "Lên kế hoạch")
                || (user.roleId === 2 && user.accountId === dataClass.projectManagerId && dataClass.projectStatus === "Lên kế hoạch")) && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: 20 }}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#D45B13" }}
                                    onClick={(e) => {
                                        if (isEditing) {
                                            e.preventDefault();
                                            toggleEdit();
                                        }
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#2F903F" }}
                                    type="submit"
                                >
                                    Lưu
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#474D57" }}
                                startIcon={<Edit />}
                                type="button"
                                onClick={(e) => {
                                    if (!isEditing) {
                                        e.preventDefault();
                                        toggleEdit();
                                    }
                                }}
                            >
                                Cập nhật
                            </Button>
                        )}
                    </div>
                )}



            {lessonClassList.length === 0 ? (
                <p>Không có dữ liệu lớp học.</p>
            ) : (
                lessonClassList.map((lesson, index) => (
                    <div key={index} className={style.lessonClassItem}>
                        <p className={style.lessonContent}>{lesson.lessonContent}</p>
                        {isEditing ? (
                            <div className={style.lessonEditForm}>
                                <Controller
                                    name={`lessons[${index}].startTime`}
                                    control={control}
                                    rules={{ required: "Bắt buộc nhập thời gian bắt đầu" }}
                                    render={({ field }) => (
                                        <TextField
                                            style={{ marginLeft: 20 }}
                                            {...field}
                                            type="time"
                                            label="Thời gian bắt đầu"
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                            }}
                                            variant="outlined"
                                            error={!!errors?.lessons?.[index]?.startTime}
                                            helperText={errors?.lessons?.[index]?.startTime?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name={`lessons[${index}].endTime`}
                                    control={control}
                                    rules={{ required: "Bắt buộc nhập thời gian kết thúc" }}
                                    render={({ field }) => (
                                        <TextField
                                            style={{ marginLeft: 20 }}
                                            {...field}
                                            type="time"
                                            label="Thời gian kết thúc"
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                            }}
                                            variant="outlined"
                                            error={!!errors?.lessons?.[index]?.endTime}
                                            helperText={errors?.lessons?.[index]?.endTime?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name={`lessons[${index}].date`}
                                    control={control}
                                    rules={{ required: "Bắt buộc nhập ngày học" }}
                                    render={({ field }) => (
                                        <TextField
                                            style={{ marginLeft: 20 }}
                                            {...field}
                                            type="date"
                                            label="Ngày học"
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                            }}
                                            variant="outlined"
                                            error={!!errors?.lessons?.[index]?.date}
                                            helperText={errors?.lessons?.[index]?.date?.message}
                                            inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                        />
                                    )}
                                />

                                <Controller
                                    name={`lessons[${index}].room`}
                                    control={control}
                                    rules={{ required: "Bắt buộc nhập phòng học" }}
                                    render={({ field }) => (
                                        <TextField
                                            style={{ marginLeft: 20 }}
                                            {...field}
                                            label="Phòng học"
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                            }}
                                            variant="outlined"
                                            error={!!errors?.lessons?.[index]?.room}
                                            helperText={errors?.lessons?.[index]?.room?.message}
                                        />
                                    )}
                                />
                            </div>
                        ) : (
                            <div>
                                {(lesson.startTime || lesson.endTime || lesson.date || lesson.room) ? (
                                    <p className={style.lessonInfo}>
                                        {formatOnlyTime(lesson.startTime)} - {formatOnlyTime(lesson.endTime)} | {formatOnlyDate(lesson.startTime)} | Room: {lesson.room}
                                    </p>
                                ) : "Chưa có thông tin"}
                            </div>
                        )}
                    </div>
                ))
            )}
        </form>
    );
};

export default LessonClass;
