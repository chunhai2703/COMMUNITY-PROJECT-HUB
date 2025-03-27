import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import { ContainerOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import classes from './ClassGroupForm.module.css'
import classNames from 'classnames/bind';
import useAuth from '../../../hooks/useAuth';
import { createRegistration } from '../../../services/RegistrationApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SetGroupClass } from '../../../services/ClassApi';
import { Tooltip } from 'antd';

const cx = classNames.bind(classes);
export const ClassGroupForm = ({ classData, fetchAllClassesOfProject }) => {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        const payload = {
            classId: classData.classId,
            numberGroup: data.numberGroup
        };

        const response = await SetGroupClass(payload);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Chia nhóm cho lớp thành công");
            handleClose();
            reset();
            // fetchAllClassesOfProject();
        } else {
            toast.error(responseData.message);
        }
    }

    return (
        <React.Fragment>
            <Tooltip title='Nhấn vào để chia nhóm'> <UsergroupAddOutlined style={{ fontSize: '18px', verticalAlign: 'middle', cursor: 'pointer', marginLeft: '8px' }} onClick={handleClickOpen} /></Tooltip>


            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }} >Chia nhóm - Tổng số học viên của lớp: {classData.totalTrainee}</DialogTitle>
                <DialogContent>
                    <form className={cx('class-group-form')}>
                        {/* Mô tả dự án */}
                        <Controller
                            name="numberGroup"
                            id="numberGroup"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập mô tả bản thân',
                                min: { value: 1, message: 'Giá trị phải lớn hơn hoặc bằng 1' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Số nhóm tạo"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type='number'
                                    error={!!errors.numberGroup}
                                    helperText={errors.numberGroup?.message}
                                />
                            )}
                        />
                    </form>

                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} className={cx('cancel-button')}>Hủy</button>
                    <button type="submit" className={cx('register-button')} onClick={handleSubmit(onSubmit)}>Chia nhóm</button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
