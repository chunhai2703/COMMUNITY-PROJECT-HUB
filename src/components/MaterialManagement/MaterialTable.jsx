import React, { useEffect, useState } from 'react';
import { ConfigProvider, Dropdown, Table, Tag, Modal as AntModal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import materials from './MaterialTable.module.css';
import classNames from 'classnames/bind';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../Spinner/Spinner';
import { CreateMaterial, DeleteMaterial, GetAllMaterial, UpdateMaterial } from '../../services/MaterialApi';
import { toast } from 'react-toastify';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { loadProjectDetails } from '../../services/ProjectsApi';

const cx = classNames.bind(materials);

export const MaterialTable = () => {
    const { projectId } = useParams();
    const { user } = useAuth();

    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [materialList, setMaterialList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataProject, setDataProject] = useState(null);

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    const fetchAllMaterial = async () => {
        setIsLoading(true);
        const response = await GetAllMaterial(projectId, searchValue, pageNumber, rowsPerPage);
        const responseData = await response.json();

        if (response.ok) {
            setMaterialList(responseData.result.getAllMaterialDTOs);
            setTotalItem(responseData.result.totalCount);
            setPageNumber(responseData.result.currentPage);
        } else {
            setMaterialList([]);
            setTotalItem(0);
            setPageNumber(1);
            console.log("Error fetching materials");
        }
        setIsLoading(false);
    };

    const fetchProjectDetail = async () => {
        setIsLoading(true);
        const responseData = await loadProjectDetails(projectId);
        setDataProject(responseData ? responseData : null)
        setIsLoading(false);
    };

    const handleInputSearch = debounce((e) => {
        setSearchValue(e.target.value);
        setPageNumber(1);
    }, 500);

    useEffect(() => {
        if (projectId) {
            fetchAllMaterial();
            fetchProjectDetail();
        }
    }, [pageNumber, searchValue, projectId]);

    const handleCreateOpen = () => {
        setOpenCreate(true);
    }

    const handleCreateClose = () => {
        setOpenCreate(false);
    }

    const handleUpdateOpen = (material) => {
        setSelectedMaterial(material);
        reset({ title: material.title });
        setOpenUpdate(true);
    };

    const handleUpdateClose = () => {
        setOpenUpdate(false);
        setSelectedMaterial(null);
    };

    const handleDeleteOpen = (material) => {
        setSelectedMaterial(material);
        setOpenDelete(true);
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
        setSelectedMaterial(null);
    };

    const onSubmitCreate = async (data) => {
        setIsLoading(true);

        const response = await CreateMaterial(data, projectId);
        const responseData = await response.json();

        if (response.ok) {
            toast.success("Tạo mới thành công!");
            fetchAllMaterial();
            handleCreateClose();
        } else {
            toast.error(responseData.message);
        }

        setIsLoading(false);
    };

    const onSubmitUpdate = async (data) => {
        if (!selectedMaterial) {
            return;
        }
        console.log(data, selectedMaterial.materialId, projectId)

        setIsLoading(true);
        const response = await UpdateMaterial(data, selectedMaterial.materialId, projectId);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Cập nhật thành công")
            fetchAllMaterial();
            handleUpdateClose();
        } else {
            toast.error(responseData.message);
        }
        setIsLoading(false);
    };

    const onConfirmDelete = async () => {
        if (!selectedMaterial) return;

        setIsLoading(true);
        const response = await DeleteMaterial(selectedMaterial.materialId);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Xóa thành công!");
            fetchAllMaterial();
            handleDeleteClose();
        } else {
            toast.error(responseData.message);
        }
        setIsLoading(false);
    };

    const getMenuItems = (material) => [
        {
            key: '1',
            label: (
                <button style={{ color: "blue" }} onClick={() => handleUpdateOpen(material)}>
                    <EditOutlined style={{ marginRight: '8px' }} /> Cập nhật
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button style={{ color: "red" }} onClick={() => handleDeleteOpen(material)}>
                    <DeleteOutlined style={{ marginRight: '8px' }} /> Xóa
                </button>
            ),
        }
    ];

    const columns = [
        {
            title: 'Tài liệu',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
        },
        {
            title: 'Link',
            dataIndex: 'materialUrl',
            key: 'materialUrl',
            align: 'center',
            render: (text, record) => (
                <a href={record.materialUrl} className='text-blue-600 underline' target="_blank" rel="noopener noreferrer" download>
                    Tải xuống
                    <DownloadOutlined style={{ marginLeft: 2 }} />
                </a>
            ),
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (record) => (
                (user.roleIdd === 4 || (user.roleId == 2 && user.accountId == dataProject?.projectManagerId)) ? (
                    <Dropdown menu={{ items: getMenuItems(record) }} placement="bottomRight" trigger={['click']}>
                        <EllipsisOutlined style={{ fontSize: "18px", color: 'black' }} />
                    </Dropdown>
                ) : null
            ),
        },
    ];

    if (!user || !projectId || !dataProject) {
        return <Spinner />
    }

    return (
        <div>
            <div className={cx('header')}>
                <p className={cx('project-title')}>{dataProject.title}</p>
            </div>
            <div className={cx('material-table-container')}>
                <div className={cx('project-detail-search')}>
                    <div className='flex w-full justify-between items-center'>
                        <div className={cx('search-box-container')}>
                            <div className={cx('search-box')}>
                                <SearchOutlined color='#285D9A' size={20} />
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm lớp học"
                                    className={cx('search-input')}
                                    onChange={(e) => handleInputSearch(e)}
                                />
                            </div>
                            <button className={cx('search-button')}>
                                <SearchOutlined color='white' size={20} style={{ marginRight: '5px' }} />
                                Tìm kiếm
                            </button>
                        </div>
                        <div>
                            <Button variant="contained" className='w-max' startIcon={<AddCircleOutlineOutlined />} sx={{ textTransform: "none" }} style={{ backgroundColor: "#474D57", marginLeft: 10 }} onClick={handleCreateOpen}>
                                Tạo mới
                            </Button>
                        </div>
                    </div>
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: '#474D57',
                                headerColor: 'white',
                            },
                        },
                    }}
                >
                    <Table
                        size='large'
                        columns={columns}
                        dataSource={materialList}
                        pagination={{
                            position: ['bottomCenter'],
                            current: pageNumber,
                            pageSize: rowsPerPage,
                            total: totalItem,
                            onChange: (page, pageSize) => {
                                setPageNumber(page);
                                setRowsPerPage(pageSize);
                            },
                        }}
                    />
                </ConfigProvider>
            </div>

            <Dialog open={openCreate} onClose={handleCreateClose}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
                    Thêm tài liệu mới
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmitCreate)}>
                    <DialogContent>
                        {/* Nhập tiêu đề tài liệu */}
                        <Controller
                            name="title"
                            control={control}
                            rules={{
                                required: 'Vui lòng nhập tiêu đề',
                            }}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    style={{ marginBottom: 10 }}
                                    label="Tiêu đề"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            }
                        />

                        {/* Chọn file tải lên */}
                        <Controller
                            name="file"
                            control={control}
                            rules={{
                                required: 'Vui lòng chọn tệp',
                            }}
                            render={({ field: { onChange, ref } }) => (
                                <div>
                                    <input
                                        type="file"
                                        accept=".pdf,.docx"
                                        ref={ref}
                                        onChange={(e) => onChange(e.target.files)}
                                    />
                                    {errors.file && <p style={{ color: 'red', marginTop: 5 }}>{errors.file.message}</p>}
                                </div>
                            )}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button
                            style={{
                                backgroundColor: "#d45b13",
                                color: "white"
                            }}
                            variant='outlined'
                            onClick={handleCreateClose}>Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                backgroundColor: "#00b300"
                            }}
                            disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : "Tạo mới"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openUpdate} onClose={handleUpdateClose}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Cập nhật tài liệu</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitUpdate)}>
                    <DialogContent>
                        <Controller
                            name="title"
                            control={control}
                            rules={{
                                required: 'Vui lòng tiêu đề',
                            }}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    style={{ marginBottom: 10 }}
                                    label="Tiêu đề"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            }
                        />
                        <Controller
                            name="file"
                            control={control}
                            rules={{
                                required: 'Vui lòng chọn tệp',
                            }}
                            render={({ field: { onChange, value, ...field } }) => (
                                <div>
                                    <input
                                        {...field}
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={(e) => onChange(e.target.files)}
                                    />
                                    {errors.file && <p style={{ color: 'red', marginTop: 5 }}>{errors.file.message}</p>}
                                </div>
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleUpdateClose}
                            style={{
                                backgroundColor: "#d45b13",
                                color: "white"
                            }}
                            variant='outlined'
                        >
                            Hủy

                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                backgroundColor: "#00b300"
                            }}
                            disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : "Cập nhật"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog Xóa */}
            <Dialog open={openDelete} onClose={handleDeleteClose}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Vô hiệu hóa tài khoản</DialogTitle>
                <DialogContent>
                    <p className='pt-3 pb-3'>Bạn có chắc muốn xóa tài liệu này?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} sx={{ textTransform: "none" }}>Hủy</Button>
                    <Button variant="contained" color="error" sx={{ textTransform: "none" }} onClick={onConfirmDelete}>Xác nhận</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};
