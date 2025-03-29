import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, FormControl, InputLabel, FormControlLabel, RadioGroup, Radio, CircularProgress, Pagination, debounce } from '@mui/material';
import { Search, AddCircleOutlineOutlined, FileUploadOutlined } from '@mui/icons-material';
import { CreateAccount, CreateAssociateAccount, GetAllAccount, ImportAccount } from '../../services/AccountApi';
import AccountTable from './AccountTable';
import { toast } from 'react-toastify';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isInactiveOpen, setIsInactiveOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [errorListImporting, setErrorListImporting] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isUpdateAssociateOpen, setIsUpdateAssociateOpen] = useState(false);
    const [isCreateAssociateOpen, setIsCreateAssociateOpen] = useState(false);
    const [selectedAssociate, setSelectedAssociate] = useState(null);


    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchAccountData();
    }, [pageNumber, rowsPerPage, searchValue]);

    const fetchAccountData = async () => {
        const response = await GetAllAccount(pageNumber, rowsPerPage, searchValue);
        const responseData = await response.json();
        if (response.ok && responseData.statusCode === 200) {
            setAccounts(responseData.result.accountResponseDTOs);
            console.log(responseData.result.accountResponseDTOs);
            setTotalPage(responseData.result.totalPages);
            setTotalItem(responseData.result.totalCount);
        } else {
            setAccounts([]);
            setTotalPage(0);
            setTotalItem(0)
        }
    };

    const handlePageChange = (event, newPage) => {
        setPageNumber(newPage);
    };

    const handleInputSearch = debounce((e) => {
        setSearchValue(e.target.value);
        setPageNumber(1);
    }, 500);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const maxDate = getTodayDate();

    const handleOpenCreate = () => {
        reset({
            accountName: "",
            pasword: "",
            fullName: "",
            phone: "",
            address: "",
            email: "",
            gender: "Nam",
            dateOfBirth: "",
            role: 1
        });
        setIsCreateOpen(true);
    };

    const handleOpenCreateAssociate = () => {
        reset({
            accountName: "",
            pasword: "",
            fullName: "",
            phone: "",
            address: "",
            email: "",
            gender: "Nam",
            dateOfBirth: "",
            associateName: "",
        });
        setIsCreateAssociateOpen(true);
    };

    const handleOpenImport = () => {
        setIsImportOpen(true);
    };

    const handleOpenUpdate = (accountId) => {
        const account = accounts.find(acc => acc.accountCode === accountId);
        setSelectedAccount(account);

        reset({
            accountName: account?.accountName || "",
            pasword: "",
            fullName: account?.fullName || "",
            phone: account?.phone || "",
            address: account?.address || "",
            email: account?.email || "",
            gender: account?.gender || "Nam",
            dateOfBirth: account?.dateOfBirth ? account.dateOfBirth.split("T")[0] : "",
            role: account?.accountId || '1'
        });

        setIsUpdateOpen(true);
    };

    const handleOpenUpdateAssociate = (accountId) => {
        const account = accounts.find(acc => acc.accountCode === accountId);
        setSelectedAccount(account);

        reset({
            accountName: account?.accountName || "",
            pasword: "",
            fullName: account?.fullName || "",
            phone: account?.phone || "",
            address: account?.address || "",
            email: account?.email || "",
            gender: account?.gender || "Nam",
            dateOfBirth: account?.dateOfBirth ? account.dateOfBirth.split("T")[0] : "",
            associateName: account?.associateName || "",
        });

        setIsUpdateAssociateOpen(true);
    };

    const handleOpenInactive = (accountId) => {
        setSelectedAccount(accounts.find(acc => acc.accountCode === accountId));
        setIsInactiveOpen(true);
    };

    const handleClosePopup = () => {
        setIsUpdateOpen(false);
        setIsInactiveOpen(false);
        setSelectedAccount(null);
        setIsCreateOpen(false)
        setIsImportOpen(false);
        setSelectedFile(null);
        setErrorListImporting([]);
        setIsCreateAssociateOpen(false);
        setIsUpdateAssociateOpen(false);
        setSelectedAssociate(null);
        reset();
    };

    const onSubmitCreate = async (data) => {
        setIsLoadingBtn(true);
        const response = await CreateAccount(data);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Tạo mới tài khoản thành công ");
            fetchAccountData();
            handleClosePopup();
        } else {
            toast.error(responseData.message);
            console.log("Error when creating new account");
        }
        setIsLoadingBtn(false);
    };

    const onSubmitCreateAssociate = async (data) => {
        setIsLoadingBtn(true);
        const response = await CreateAssociateAccount(data);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Tạo mới tài khoản đối tác thành công ");
            fetchAccountData();
            handleClosePopup();
        } else {
            toast.error(responseData.message);
            console.log("Error when creating new associate account");
        }
        setIsLoadingBtn(false);
    };

    const onSubmitUpdate = (data) => {
        console.log("Updated Data:", data);
        toast.success("Cập nhật thành công!");
        handleClosePopup();
    };

    const onSubmitUpdateAssociate = (data) => {
        console.log("Updated Data Associate:", data);
        toast.success("Cập nhật thành công!");
        handleClosePopup();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel")) {
            setSelectedFile(file);
        } else {
            toast.error("Chỉ chấp nhận file Excel (.xls, .xlsx)");
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Vui lòng chọn một file Excel");
            return;
        }

        setIsLoadingBtn(true);
        const response = await ImportAccount(selectedFile);
        const responseData = await response.json();
        if (response.ok) {
            toast.success("Import tài khoản thành công");
            setSelectedFile(null);
            setErrorListImporting([]);
            fetchAccountData();
            handleClosePopup();
        } else {
            toast.error(responseData.message);
            setErrorListImporting(responseData.result);
            console.log("Error when importing account");
        }

        setIsLoadingBtn(false);
    };

    return (
        <Box className="ml-4 mr-4">
            <p className='text-3xl mb-6 mt-6'>Quản lý tài khoản</p>
            <Box className="mb-6 flex justify-between">
                <div>
                    <TextField
                        style={{ width: 300 }}
                        placeholder="Nhập từ khóa tìm kiếm"
                        size='small'
                        InputProps={{
                            startAdornment: <Search />,
                        }}
                        onChange={(e) => handleInputSearch(e)}
                    />
                    <Button
                        variant="contained"
                        className='w-max'
                        style={{ backgroundColor: "#474D57", marginLeft: 10 }}
                        sx={{ textTransform: "none" }}
                    >
                        <Search /> Tìm kiếm
                    </Button>
                </div>
                <div>
                    <Button variant="contained" className='w-max' startIcon={<FileUploadOutlined />} style={{ backgroundColor: "#D45B13" }} sx={{ textTransform: "none" }} onClick={handleOpenImport}>
                        Import
                    </Button>
                    <Button variant="contained" className='w-max' startIcon={<AddCircleOutlineOutlined />} sx={{ textTransform: "none" }} style={{ backgroundColor: "#474D57", marginLeft: 10 }} onClick={handleOpenCreateAssociate}>
                        Tạo mới đối tác
                    </Button>
                    <Button variant="contained" className='w-max' startIcon={<AddCircleOutlineOutlined />} sx={{ textTransform: "none" }} style={{ backgroundColor: "#474D57", marginLeft: 10 }} onClick={handleOpenCreate}>
                        Tạo mới
                    </Button>
                </div>
            </Box>

            <AccountTable accounts={accounts} onUpdate={handleOpenUpdate} onUpdateAssociate={handleOpenUpdateAssociate} onInactive={handleOpenInactive} />
            <div className='flex justify-center mt-5 mb-5'>
                <Pagination

                    count={totalPage}
                    page={pageNumber}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </div>

            <Dialog open={isImportOpen} onClose={handleClosePopup}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Import file Excel</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept=".xls,.xlsx"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button variant="contained" component="span" style={{ marginTop: 10 }} sx={{ textTransform: "none" }}>
                            Chọn file Excel
                        </Button>
                    </label>
                    {selectedFile && <p style={{ marginTop: 10 }}>{selectedFile.name}</p>}
                    {errorListImporting && errorListImporting.map((error, index) => (
                        <p key={index} style={{ color: "red", marginTop: 5 }}>• {error}</p>
                    ))}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} color="secondary">Hủy</Button>
                    <Button
                        onClick={handleUpload}
                        color="primary"
                        variant="contained"
                        disabled={isLoadingBtn}
                        sx={{ textTransform: "none" }}>
                        {isLoadingBtn ? <CircularProgress size={24} color="inherit" /> : "Tải lên"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCreateOpen} onClose={handleClosePopup}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Tạo tài khoản mới</DialogTitle>
                <DialogContent className='mt-2'>
                    <form onSubmit={handleSubmit(onSubmitCreate)}>
                        <Controller
                            name="accountName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập tên tài khoản',
                                minLength: {
                                    value: 5,
                                    message: 'Tên tài khoản phải có ít nhất 5 ký tự'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tên tài khoản"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.accountName}
                                    helperText={errors.accountName?.message}
                                />
                            )}
                        />

                        <Controller
                            name="fullName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập họ và tên',
                                minLength: {
                                    value: 8,
                                    message: 'Họ và tên phải có ít nhất 8 ký tự'
                                },
                                pattern: {
                                    value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                                    message: 'Họ và tên không hợp lệ',
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ và tên"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: /^0\d{9}$/,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Số điện thoại"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập địa chỉ'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Địa chỉ"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Email không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập ngày sinh',
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ngày sinh"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth?.message}
                                    inputProps={{
                                        max: maxDate,
                                    }}
                                />
                            )}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink>
                                Giới tính
                            </InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue="Nam"
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink>
                                Vai trò
                            </InputLabel>
                            <Controller
                                name="role"
                                control={control}
                                defaultValue={1}
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value={1} control={<Radio />} label="Student" />
                                        <FormControlLabel value={2} control={<Radio />} label="Lecturer" />
                                        <FormControlLabel value={3} control={<Radio />} label="Trainee" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClosePopup} sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoadingBtn}
                                sx={{ textTransform: "none" }}>
                                {isLoadingBtn ? <CircularProgress size={24} color="inherit" /> : "Tạo"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isCreateAssociateOpen} onClose={handleClosePopup}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Tạo tài khoản đối tác mới</DialogTitle>
                <DialogContent className='mt-2'>
                    <form onSubmit={handleSubmit(onSubmitCreateAssociate)}>
                        <Controller
                            name="accountName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập tên tài khoản',
                                minLength: {
                                    value: 5,
                                    message: 'Tên tài khoản phải có ít nhất 5 ký tự'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tên tài khoản"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.accountName}
                                    helperText={errors.accountName?.message}
                                />
                            )}
                        />

                        <Controller
                            name="fullName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập họ và tên',
                                minLength: {
                                    value: 8,
                                    message: 'Họ và tên phải có ít nhất 8 ký tự'
                                },
                                pattern: {
                                    value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                                    message: 'Họ và tên không hợp lệ',
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ và tên"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: /^0\d{9}$/,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Số điện thoại"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập địa chỉ'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Địa chỉ"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Email không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập ngày sinh',
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ngày sinh"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth?.message}
                                    inputProps={{
                                        max: maxDate,
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="associateName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập tên đối tác'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tên đối tác"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.associateName}
                                    helperText={errors.associateName?.message}
                                />
                            )}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink>
                                Giới tính
                            </InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue="Nam"
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClosePopup} sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoadingBtn}
                                sx={{ textTransform: "none" }}>
                                {isLoadingBtn ? <CircularProgress size={24} color="inherit" /> : "Tạo"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isUpdateOpen} onClose={handleClosePopup}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Cập nhật tài khoản</DialogTitle>
                <DialogContent className='mt-2'>
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <Controller
                            name="fullName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập họ và tên',
                                minLength: {
                                    value: 8,
                                    message: 'Họ và tên phải có ít nhất 8 ký tự'
                                },
                                pattern: {
                                    value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                                    message: 'Họ và tên không hợp lệ',
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ và tên"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: /^0\d{9}$/,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Số điện thoại"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập địa chỉ'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Địa chỉ"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Email không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập ngày sinh',
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ngày sinh"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth?.message}
                                    inputProps={{
                                        max: maxDate,
                                    }}
                                />
                            )}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink>
                                Giới tính
                            </InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue="Nam"
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClosePopup} sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: "none" }}>Lưu</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isUpdateAssociateOpen} onClose={handleClosePopup}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Tạo tài khoản đối tác mới</DialogTitle>
                <DialogContent className='mt-2'>
                    <form onSubmit={handleSubmit(onSubmitUpdateAssociate)}>
                        <Controller
                            name="accountName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập tên tài khoản',
                                minLength: {
                                    value: 5,
                                    message: 'Tên tài khoản phải có ít nhất 5 ký tự'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tên tài khoản"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.accountName}
                                    helperText={errors.accountName?.message}
                                />
                            )}
                        />

                        <Controller
                            name="fullName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập họ và tên',
                                minLength: {
                                    value: 8,
                                    message: 'Họ và tên phải có ít nhất 8 ký tự'
                                },
                                pattern: {
                                    value: /^[\p{L}]+([\s\p{L}]+)*$/u,
                                    message: 'Họ và tên không hợp lệ',
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ và tên"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập số điện thoại',
                                pattern: {
                                    value: /^0\d{9}$/,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Số điện thoại"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập địa chỉ'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Địa chỉ"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Email không hợp lệ',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập ngày sinh',
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ngày sinh"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth?.message}
                                    inputProps={{
                                        max: maxDate,
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="associateName"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Vui lòng nhập tên đối tác'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tên đối tác"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.associateName}
                                    helperText={errors.associateName?.message}
                                />
                            )}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink>
                                Giới tính
                            </InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue="Nam"
                                render={({ field }) => (
                                    <RadioGroup {...field} row>
                                        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClosePopup} sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoadingBtn}
                                sx={{ textTransform: "none" }}>
                                {isLoadingBtn ? <CircularProgress size={24} color="inherit" /> : "Tạo"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isInactiveOpen} onClose={handleClosePopup}>
                <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>Vô hiệu hóa tài khoản</DialogTitle>
                <DialogContent>
                    <p className='pt-3 pb-3'>Bạn có chắc muốn vô hiệu hóa tài khoản có ID: {selectedAccount?.accountCode}?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} sx={{ textTransform: "none" }}>Hủy</Button>
                    <Button variant="contained" color="error" sx={{ textTransform: "none" }}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountManagement;
