import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { SendOtpEmail, CheckOtp, ChangePassword } from "../../services/AuthenApi";
import useAuth from "../../hooks/useAuth";
import { Loading } from "../Global/Loading";

export const ChangePasswordForm = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSendEmail = async (data) => {
        if (user) {
            setIsLoading(true);
            const response = await SendOtpEmail(user.email);
            const responseData = await response.json();
            if (response.ok) {
                toast.success("OTP đã được gửi đến email!");
                setEmail(data.email);
                setStep(2);
            } else {
                toast.error(responseData.message);
            }

            setIsLoading(false);
        }
    };

    const onVerifyOtp = async (data) => {
        if (user) {
            setIsLoading(true);
            const response = await CheckOtp(user.email, data.otp);
            const responseData = await response.json();
            if (response.ok) {
                toast.success("OTP hợp lệ, vui lòng đặt lại mật khẩu!");
                setStep(3);
            } else {
                toast.error(responseData.message);
            }
            setIsLoading(false);
        }
    };

    const onResetPassword = async (data) => {
        if (user) {
            setIsLoading(true);
            if (data.password !== data.confirmPassword) {
                toast.error("Mật khẩu xác nhận không khớp!");
                setIsLoading(false);
                return;
            }

            const response = await ChangePassword(data.password, data.confirmPassword, user.email);
            const responseData = await response.json();

            if (response.ok) {
                toast.success("Đặt lại mật khẩu thành công!");
                setStep(1);
            } else {
                toast.error(responseData.message);
            }

            setIsLoading(false);
        }
    };

    if (!user) {
        return (
           <Loading />
        );
    }


    return (

        <Box sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" textAlign="center" mb={2}>
                {step === 1 && "Gửi OTP"}
                {step === 2 && "Nhập OTP"}
                {step === 3 && "Đặt Lại Mật Khẩu"}
            </Typography>

            {step === 1 && (
                <>
                    <p style={{ marginBottom: "15px", textAlign: "center" }}>OTP sẽ đươc gửi đến email của bạn</p>
                    <Button fullWidth onClick={onSendEmail} variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Gửi OTP"}
                    </Button>
                </>

            )}

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
