import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { SendOtpEmail, CheckOtp, ChangePassword } from "../../services/AuthenApi";

export const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    // Xử lý gửi email
    const onSendEmail = async (data) => {
        setIsLoading(true);
        const response = await SendOtpEmail(data.email);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("OTP đã được gửi đến email!");
            setEmail(data.email);
            setStep(2);
        } else {
            toast.error(responseData.message);
        }

        setIsLoading(false);
    };

    // Xác nhận OTP
    const onVerifyOtp = async (data) => {
        setIsLoading(true);
        const response = await CheckOtp(email, data.otp);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("OTP hợp lệ, vui lòng đặt lại mật khẩu!");
            setStep(3);
        } else {
            toast.error(responseData.message);
        }
        setIsLoading(false);
    };

    // Đặt lại mật khẩu
    const onResetPassword = async (data) => {
        setIsLoading(true);
        if (data.password !== data.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            setIsLoading(false);
            return;
        }

        const response = await ChangePassword(data.password, data.confirmPassword, email);
        const responseData = await response.json();

        if (response.ok) {
            toast.success("Đặt lại mật khẩu thành công!");
            setStep(1);
        } else {
            toast.error(responseData.message);
        }

        setIsLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" textAlign="center" mb={2}>
                {step === 1 && "Quên Mật Khẩu"}
                {step === 2 && "Nhập OTP"}
                {step === 3 && "Đặt Lại Mật Khẩu"}
            </Typography>

            {/* Bước 1: Nhập email */}
            {step === 1 && (
                <form onSubmit={handleSubmit(onSendEmail)}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="text"
                        {...register("email", {
                            required: "Vui lòng nhập email!",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Email không hợp lệ!",
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        margin="normal"
                    />
                    <Button fullWidth type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Gửi OTP"}
                    </Button>
                </form>
            )}

            {/* Bước 2: Nhập OTP */}
            {step === 2 && (
                <form onSubmit={handleSubmit(onVerifyOtp)}>
                    <TextField
                        fullWidth
                        label="Mã OTP"
                        {...register("otp", {
                            required: "Vui lòng nhập mã OTP!",
                            pattern: {
                                value: /^[0-9]{6}$/,
                                message: "OTP phải có 6 chữ số!",
                            },
                        })}
                        error={!!errors.otp}
                        helperText={errors.otp?.message}
                        margin="normal"
                    />
                    <Button fullWidth type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Xác nhận OTP"}
                    </Button>
                </form>
            )}

            {/* Bước 3: Nhập mật khẩu mới */}
            {step === 3 && (
                <form onSubmit={handleSubmit(onResetPassword)}>
                    <TextField
                        fullWidth
                        label="Mật khẩu mới"
                        type="password"
                        {...register("password", {
                            required: "Vui lòng nhập mật khẩu!",
                            pattern: {
                                value: /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                                message: "Mật khẩu phải có ít nhất 8 ký tự và 1 ký tự đặc biệt",
                            },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Xác nhận mật khẩu"
                        type="password"
                        {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu!",
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        margin="normal"
                    />

                    <Button fullWidth type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Đặt lại mật khẩu"}
                    </Button>
                </form>
            )}
        </Box>
    );
};
