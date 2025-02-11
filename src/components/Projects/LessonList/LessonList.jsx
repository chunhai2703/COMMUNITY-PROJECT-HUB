import { Controller, useForm } from "react-hook-form";
import { Spinner } from "../../Spinner/Spinner";
import { Button, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import style from "./LessonList.module.css";

const data = [
    { lessonNo: 1, lessonContent: "Trí tuệ nhân tạo - Công cụ đắc lực cho nhà giáo hiện đại" },
    { lessonNo: 2, lessonContent: "Cá nhân hóa quá trình học tập với AI" },
    { lessonNo: 3, lessonContent: "Tự động hóa các tác vụ lặp đi lặp lại" }
];

const LessonList = () => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: { lessons: data }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            data.forEach((lesson, index) => {
                setValue(`lessons[${index}].lessonContent`, lesson.lessonContent);
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

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <p className={style.lessonTitle}>Nội dung khóa học</p>
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
                <div key={index} className={style.lessonItem}>
                    <p className={style.lessonContent}>LessonNo: {lesson.lessonNo}</p>
                    {isEditing ? (
                        <div className={style.lessonEditForm}>
                            <Controller
                                name={`lessons[${index}].lessonContent`}
                                control={control}
                                rules={{ required: "Vui lòng nhập nội dung buổi học" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        sx={{ width: '100%' }}
                                        label="Nội dung buổi học"
                                        variant="outlined"
                                        error={!!errors?.lessons?.[index]?.lessonContent}
                                        helperText={errors?.lessons?.[index]?.lessonContent?.message}
                                    />
                                )}
                            />
                        </div>
                    ) : (
                        <p>{lesson.lessonContent}</p>
                    )}
                </div>
            ))}
        </form>
        </div>
    );
};

export default LessonList;
