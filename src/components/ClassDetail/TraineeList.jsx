import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Table,
  Tag,
  Modal as AntModal,
  message,
  Avatar,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  SearchOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import trainees from "./TraineeList.module.css";
import classNames from "classnames/bind";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import {
  ExportTraineeList,
  ExportTraineeListTemplate,
  GetAllTraineeOfClass,
  RemoveTrainee,
} from "../../services/TraineeApi";
import { AddTrainee } from "../Popup/Class/AddTrainee";
import { AddNewTrainee } from "../Popup/Class/AddNewTrainee";

const cx = classNames.bind(trainees);

const TraineeList = ({ dataClass }) => {
  const { user } = useAuth();
  const { classId } = useParams();

  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [traineeList, setTraineeList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [totalItem, setTotalItem] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [reason, setReason] = useState("");
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const [avatarBackground, setAvatarBackground] = useState("");

  // Hàm lấy màu random cho avatar
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Fetch danh sách thông báo khi component mount
  useEffect(() => {
    const storedColor = getRandomColor();
    setAvatarBackground(storedColor);
  }, [selectedTrainee]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const fetchAllTrainee = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetAllTraineeOfClass(
        classId,
        searchValue,
        pageNumber,
        rowsPerPage,
        sortColumn,
        sortOrder
      );
      const responseData = await response.json();

      if (response.ok) {
        setTraineeList(responseData.result.getAllTraineeOfClassDTOs);
        setTotalItem(responseData.result.totalCount);
        setPageNumber(responseData.result.currentPage);
      } else {
        setTraineeList([]);
        setTotalItem(0);
        setPageNumber(1);
      }
    } catch (error) {
      console.error("Error fetching trainee:", error);
    } finally {
      setIsLoading(false);
    }
  }, [classId, searchValue, pageNumber, rowsPerPage, sortColumn, sortOrder]);

  const handleTableChange = (pagination, filters, sorter, event) => {
    if (sorter.order) {
      setSortColumn(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC");
    } else {
      setSortColumn("");
      setSortOrder("");
    }
  };

  useEffect(() => {
    fetchAllTrainee();
  }, [classId, pageNumber, rowsPerPage, sortColumn, sortOrder]);

  const handleDetailOpen = (trainee) => {
    setSelectedTrainee(trainee);
    setOpenDetail(true);
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
    setSelectedTrainee(null);
  };

  const handleSearch = () => {
    setPageNumber(1); // Reset về trang đầu tiên khi tìm kiếm
    fetchAllTrainee(); // Gọi API để tìm kiếm
  };

  const handleExportScoreTemplate = async () => {
    setIsLoading(true);
    const response = await ExportTraineeListTemplate(classId);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "DanhSachHocVien.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Tải mẫu điểm thành công!");
    } else {
      toast.error("Tải mẫu điểm thất bại!");
    }
    setIsLoading(false);
  };

  const handleDeleteOpen = (trainee) => {
    setSelectedTrainee(trainee);
    setOpenDelete(true);
  };

  const handleDeleteClose = (trainee) => {
    setSelectedTrainee(null);
    setOpenDelete(false);
  };

  const onConfirmDelete = async () => {
    setIsLoading(true);
    const response = await RemoveTrainee(
      classId,
      selectedTrainee.traineeId,
      reason
    );
    const responseData = await response.json();

    if (response.ok) {
      toast.success("Xóa học viên thành công");
      setOpenDelete(false);
      setSelectedTrainee(null);
      fetchAllTrainee();
    } else {
      toast.error(responseData.message);
    }
    setIsLoading(false);
  };

  const getMenuItems = (trainee) => {
    const items = [
      {
        key: "1",
        label: (
          <button
            style={{ fontWeight: "600" }}
            onClick={() => handleDetailOpen(trainee)}
          >
            <InfoCircleOutlined style={{ marginRight: "8px" }} />
            Xem chi tiết
          </button>
        ),
      },
    ];

    if (
      user?.accountId === dataClass.projectManagerId &&
      dataClass.projectStatus === "Lên kế hoạch"
    ) {
      items.push({
        key: "2",
        label: (
          <button
            style={{ color: "red" }}
            onClick={() => handleDeleteOpen(trainee)}
          >
            <InfoCircleOutlined style={{ marginRight: "8px" }} /> Xóa
          </button>
        ),
      });
    }

    return items;
  };

  const getColumn = () => {
    const columns = [
      {
        title: "ID",
        dataIndex: "accountCode",
        key: "accountCode",
        align: "center",
        sorter: true,
      },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        align: "center",
        sorter: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        align: "center",
        sorter: true,
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        align: "center",
      },
      {
        title: "Nhóm",
        dataIndex: "groupNo",
        key: "groupNo",
        align: "center",
        sorter: true,
        render: (text, record) =>
          text === 0 ? (
            <span style={{ color: "red", fontWeight: 500 }}>Chưa có</span>
          ) : (
            text
          ),
      },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        align: "center",
      },
    ];

    if (
      user?.roleId === 2 &&
      user?.accountId === dataClass.lecturerId &&
      dataClass.projectStatus === "Đang diễn ra"
    ) {
      columns.push(
        {
          title: "Báo cáo",
          dataIndex: "reportContent",
          key: "reportContent",
          align: "center",
          render: (record) =>
            record ? (
              <a
                href={record}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Tải xuống
                <DownloadOutlined style={{ marginLeft: 2 }} />
              </a>
            ) : (
              "N/A"
            ),
        },
        {
          title: "Ngày nộp báo cáo",
          dataIndex: "reportCreatedDate",
          key: "reportCreatedDate",
          align: "center",
          render: (record) => (record ? formatDate(record) : "N/A"),
        }
      );
    }

    columns.push({
      title: "",
      key: "action",
      align: "center",
      render: (record) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <EllipsisOutlined style={{ fontSize: "18px", color: "black" }} />
        </Dropdown>
      ),
    });

    return columns;
  };

  if (!user || !classId || isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className={cx("trainee-table-container")}>
        <p className="text-3xl">Quản lý học viên</p>
        <div className={cx("trainee-detail-search")}>
          <div className="flex w-full justify-between items-center">
            <div className={cx("search-box-container")}>
              <div className={cx("search-box")}>
                <SearchOutlined color="#285D9A" size={20} />
                <input
                  type="search"
                  placeholder="Tìm kiếm học viên"
                  className={cx("search-input")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Nhấn Enter để tìm kiếm
                />
              </div>
              <button className={cx("search-button")} onClick={handleSearch}>
                <SearchOutlined
                  color="white"
                  size={20}
                  style={{ marginRight: "5px" }}
                />
                Tìm kiếm
              </button>
            </div>
            {user?.accountId === dataClass.projectManagerId &&
              dataClass.projectStatus === "Lên kế hoạch" && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <AddTrainee classId={classId} refresh={fetchAllTrainee} />
                  <AddNewTrainee classId={classId} refresh={fetchAllTrainee} />
                </div>
              )}

            {(user.accountId === dataClass.lecturerId ||
              user.accountId === dataClass.projectManagerId ||
              user.roleId === 4) &&
              dataClass.projectStatus === "Đang diễn ra" && (
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  style={{
                    backgroundColor: "#034ea2",
                    color: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    marginRight: "8px",
                  }}
                  onClick={handleExportScoreTemplate}
                >
                  <DownloadOutlined
                    color="white"
                    size={20}
                    style={{ marginRight: "5px" }}
                  />
                  Tải mẫu
                </Button>
              )}
          </div>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#474D57",
                headerColor: "white",
                headerSortActiveBg: "gray",
                headerSortHoverBg: "gray",
              },
            },
          }}
        >
          <Table
            size="large"
            columns={getColumn()}
            dataSource={traineeList.map((trainee) => ({
              key: trainee.traineeId,
              traineeId: trainee.account.accountId,
              accountCode: trainee.account.accountCode,
              fullName: trainee.account.fullName,
              email: trainee.account.email,
              phone: trainee.account.phone,
              gender: trainee.account.gender,
              birthdate: trainee.account.dateOfBirth,
              avatar: trainee.account.avatarLink,
              feedbackCreatedDate: trainee.feedbackCreatedDate,
              feedbackContent: trainee.feedbackContent,
              reportCreatedDate: trainee.reportCreatedDate,
              reportContent: trainee.reportContent,
              groupNo: trainee.groupNo,
            }))}
            pagination={{
              position: ["bottomCenter"],
              current: pageNumber,
              pageSize: rowsPerPage,
              total: totalItem,
              onChange: (page, pageSize) => {
                setPageNumber(page);
                setRowsPerPage(pageSize);
              },
            }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          />
        </ConfigProvider>
      </div>

      <Dialog
        open={openDetail}
        onClose={handleDetailClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Thông tin chi tiết
        </DialogTitle>
        <DialogContent>
          {selectedTrainee &&
            (console.log(selectedTrainee),
            (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: 25,
                }}
              >
                <div className="flex">
                  <div className="w-1/2" style={{ marginRight: 5 }}>
                    <Avatar
                      src={
                        selectedTrainee.avatar ? (
                          <img src={selectedTrainee?.avatar} alt="avatar" />
                        ) : null
                      }
                      style={{
                        backgroundColor: selectedTrainee.avatar
                          ? ""
                          : avatarBackground,
                        color: avatarBackground ? "#fff" : "",
                        fontSize: 100,
                      }}
                      size={200}
                    >
                      {!selectedTrainee.avatar
                        ? selectedTrainee.fullName.charAt(0)
                        : ""}
                    </Avatar>
                  </div>
                  <div className="w-1/2" style={{ flex: 1 }}>
                    <TextField
                      style={{ marginBottom: 18 }}
                      label="ID"
                      fullWidth
                      value={selectedTrainee.accountCode}
                      variant="outlined"
                    />
                    <TextField
                      label="Họ và tên"
                      fullWidth
                      value={selectedTrainee.fullName}
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="flex mt-2">
                  <TextField
                    style={{ marginRight: 10 }}
                    label="Email"
                    fullWidth
                    value={selectedTrainee.email}
                    variant="outlined"
                  />
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    value={selectedTrainee.phone}
                    variant="outlined"
                  />
                </div>
                <div className="flex mt-2">
                  <TextField
                    style={{ marginRight: 10 }}
                    label="Ngày sinh"
                    fullWidth
                    value={formatDate(selectedTrainee.birthdate)}
                    variant="outlined"
                  />
                  <TextField
                    label="Giới tính"
                    fullWidth
                    value={selectedTrainee.gender}
                    variant="outlined"
                  />
                </div>
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDetailClose}
            style={{ textTransform: "none" }}
            type="primary"
            size="large"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Xóa học viên
        </DialogTitle>
        <DialogContent>
          <p className="pt-3 pb-3">
            Bạn có chắc muốn xóa học viên này ra khỏi lớp?
          </p>
          <TextField
            label="Lý do"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
            onClick={onConfirmDelete}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TraineeList;
