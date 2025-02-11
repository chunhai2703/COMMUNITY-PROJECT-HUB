import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import style from "./LessonClass.module.css";
import { Spinner } from "../Spinner/Spinner";
import { Button, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";

const data = [
    {
        lessonContent: "Trí tuệ nhân tạo - Công cụ đắc lực cho nhà giáo hiện đại",
        startTime: "09:00",
        endTime: "11:00",
        date: "2025-06-16",
        room: "306",
    },
    {
        lessonContent: "Cá nhân hóa quá trình học tập với AI",
        startTime: "09:00",
        endTime: "11:00",
        date: "2025-06-17",
        room: "306",
    },
    {
        lessonContent: "Tự động hóa các tác vụ lặp đi lặp lại",
        startTime: "09:00",
        endTime: "13:00",
        date: "2025-06-18",
        room: "309",
    }
];

const LessonClass = () => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
            defaultValues: { lessons: data }
        });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            data.forEach((lesson, index) => {
                setValue(`lessons[${index}].startTime`, lesson.startTime);
                setValue(`lessons[${index}].endTime`, lesson.endTime);
                setValue(`lessons[${index}].date`, lesson.date);
                setValue(`lessons[${index}].room`, lesson.room);
            });
        }
    }, [isEditing, setValue]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = (updatedData) => {
        console.log("Updated Lessons:", updatedData.lessons);
        setIsEditing(false);
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                <Button
                    variant="contained"
                    className="w-max"
                    startIcon={<Edit />}
                    sx={{ textTransform: "none" }}
                    style={{ backgroundColor: "#474D57" }}
                    onClick={(e) => {
                        if (!isEditing) {
                            e.preventDefault();
                            toggleEdit();
                        }
                    }}
                    type={isEditing ? "submit" : "button"}
                >
                    {isEditing ? "Lưu" : "Cập nhật"}
                </Button>
            </div>
            {data.map((lesson, index) => (
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
                                        className={style.fieldInput}
                                        {...field}
                                        type="time"
                                        label="Thời gian bắt đầu"
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
                                        className={style.fieldInput}
                                        {...field}
                                        type="time"
                                        label="Thời gian kết thúc"
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
                                        className={style.fieldInput}
                                        {...field}
                                        type="date"
                                        label="Ngày học"
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
                                        className={style.fieldInput}
                                        {...field}
                                        label="Phòng học"
                                        variant="outlined"
                                        error={!!errors?.lessons?.[index]?.room}
                                        helperText={errors?.lessons?.[index]?.room?.message}
                                    />
                                )}
                            />

                        </div>
                    ) : (
                        <p className={style.lessonInfo}>
                            {lesson.startTime} - {lesson.endTime} | {lesson.date} | {lesson.room}
                        </p>
                    )}
                </div>
            ))}
        </form>
    );
};

export default LessonClass;
