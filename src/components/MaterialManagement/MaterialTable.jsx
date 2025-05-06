import React, { useCallback, useEffect, useState } from "react";
import {
  ConfigProvider,
  Dropdown,
  Table,
  Tag,
  Modal as AntModal,
  message,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import materials from "./MaterialTable.module.css";
import classNames from "classnames/bind";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { debounce, set } from "lodash";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import {
  CreateMaterial,
  DeleteMaterial,
  GetAllMaterial,
  UpdateMaterial,
} from "../../services/MaterialApi";
import { toast } from "react-toastify";
import {
  AddCircleOutlineOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import { loadProjectDetails } from "../../services/ProjectsApi";
import { ProjectStandard } from "../Popup/Project/ProjectStandard";

const cx = classNames.bind(materials);

export const MaterialTable = (props) => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const project = location.state?.project;
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

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const fetchAllMaterial = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllMaterial(
      projectId,
      searchValue,
      pageNumber,
      rowsPerPage
    );
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
  }, [pageNumber, searchValue, projectId, rowsPerPage]);

  const fetchProjectDetail = useCallback(async () => {
    setIsLoading(true);
    const responseData = await loadProjectDetails(projectId);
    setDataProject(responseData ? responseData : null);
    setIsLoading(false);
  }, [projectId]);

  const handleInputSearch = debounce((e) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  }, 500);

  useEffect(() => {
    if (projectId) {
      fetchAllMaterial();
      fetchProjectDetail();
    }
  }, [fetchAllMaterial, fetchProjectDetail, projectId]);

  const handleCreateOpen = () => {
    setOpenCreate(true);
    reset();
  };

  const handleCreateClose = () => {
    setOpenCreate(false);
    reset();
  };

  const handleUpdateOpen = (material) => {
    reset({ title: material.title, materialId: material.materialId });
    setSelectedMaterial(material);
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
    setSelectedMaterial(null);
    reset();
  };

  const handleDeleteOpen = (material) => {
    setSelectedMaterial(material);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectedMaterial(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
        file.type === "application/msword" || // .doc
        file.type === "application/pdf") // .pdf
    ) {
      setSelectedMaterial(file);
    } else {
      toast.error("Chỉ chấp nhận file Word (.doc, .docx) hoặc PDF (.pdf)");
      setSelectedMaterial(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedMaterial) {
      toast.error("Vui lòng chọn một file Word hoặc PDF");
      return;
    }
  };

  const onSubmitCreate = async (data) => {
    setIsLoading(true);

    const response = await CreateMaterial(data, projectId, user?.accountId);
    const responseData = await response.json();

    if (response.ok) {
      toast.success("Tạo mới tài liệu thành công!");
      fetchAllMaterial();
      handleCreateClose();
      setSelectedMaterial(null);
      reset();
    } else {
      toast.error(responseData.message || "Tạo mới tài liệu thất bại!");
    }

    setIsLoading(false);
  };

  const onSubmitUpdate = async (data) => {
    if (!data.materialId) {
      toast.error("Không tìm thấy ID tài liệu cần cập nhật");
      return;
    }
    console.log(data, data.materialId, projectId);

    setIsLoading(true);
    const response = await UpdateMaterial(
      data,
      data.materialId,
      projectId,
      user?.accountId
    );
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Cập nhật tài liệu thành công");
      fetchAllMaterial();
      handleUpdateClose();
      setSelectedMaterial(null);
      reset();
    } else {
      toast.error(responseData.message || "Lỗi khi cập nhật tài liệu");
    }
    setIsLoading(false);
  };

  const onConfirmDelete = async () => {
    if (!selectedMaterial) return;

    setIsLoading(true);
    const response = await DeleteMaterial(selectedMaterial.materialId);
    const responseData = await response.json();
    if (response.ok) {
      toast.success("Xóa tài liệu thành công!");
      fetchAllMaterial();
      handleDeleteClose();
    } else {
      toast.error(responseData.message);
    }
    setIsLoading(false);
  };

  const getMenuItems = (material) => [
    {
      key: "1",
      label: (
        <button
          style={{ color: "#347ee7", fontWeight: "600" }}
          onClick={() => handleUpdateOpen(material)}
        >
          <EditOutlined style={{ marginRight: "8px" }} /> Cập nhật
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          style={{ color: "red", fontWeight: "600" }}
          onClick={() => handleDeleteOpen(material)}
        >
          <DeleteOutlined style={{ marginRight: "8px" }} /> Xóa
        </button>
      ),
    },
  ];

  const columns = [
    {
      title: "Tài liệu",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Link",
      dataIndex: "materialUrl",
      key: "materialUrl",
      align: "center",
      render: (text, record) => (
        <a
          href={record.materialUrl}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Tải xuống
          <DownloadOutlined style={{ marginLeft: 2 }} />
        </a>
      ),
    },
    {
      title: "Người chỉnh sửa",
      dataIndex: "uploadedFullName",
      key: "uploadedFullName",
      align: "center",
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (record) =>
        user.roleId === 4 ||
        (user.roleId === 2 &&
          user.accountId === dataProject?.projectManagerId) ? (
          <Dropdown
            menu={{ items: getMenuItems(record) }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <EllipsisOutlined style={{ fontSize: "18px", color: "black" }} />
          </Dropdown>
        ) : null,
    },
  ];

  const items = [
    {
      key: "1",
      label: "Phần điểm danh",
      children: (
        <>
          {dataProject?.maxAbsentPercentage !== null ? (
            <p>
              Học viên được nghỉ{" "}
              <span style={{ fontStyle: "italic", fontWeight: 600 }}>
                không quá {dataProject?.maxAbsentPercentage || 0} %
              </span>{" "}
              trên tổng các buổi học.
            </p>
          ) : (
            <p style={{ fontWeight: 600, color: "red" }}>Chưa có cập nhật</p>
          )}
        </>
      ),
    },

    {
      key: "2",
      label: "Phần điểm số",
      children: (
        <>
          {dataProject?.failingScore !== null ? (
            <p>
              Học viên phải có điểm báo cáo cuối cùng{" "}
              <span style={{ fontStyle: "italic", fontWeight: 600 }}>
                lớn hơn hoặc bằng {dataProject?.failingScore || 0} điểm.
              </span>
            </p>
          ) : (
            <p style={{ fontWeight: 600, color: "red" }}>Chưa có cập nhật</p>
          )}
        </>
      ),
    },
    {
      key: "3",
      label: "Lưu ý",
      children: (
        <p>
          Bài báo cáo các học viên phải hoàn thành và nộp trước thời gian buổi
          học cuối cùng bắt đầu.{" "}
        </p>
      ),
    },
  ];

  if (!user || !projectId || !dataProject) {
    return <Spinner />;
  }

  return (
    <div>
      <div className={cx("header")}>
        <p className={cx("project-title")}>{dataProject.title}</p>
      </div>
      <div className={cx("material-table-container")}>
        <h2 className={cx("material-title")}>Tài liệu cho dự án</h2>
        <div className={cx("material-standard")}>
          <ConfigProvider
            theme={{
              token: {
                fontSize: 16,
              },
            }}
          >
            <Descriptions
              column={1}
              title="📋 Tiêu chuẩn đánh giá kết quả"
              size="default"
              extra={
                user?.roleId === 4 && dataProject?.status === "Lên kế hoạch" ? (
                  <ProjectStandard
                    project={dataProject}
                    refresh={fetchProjectDetail}
                    refreshMaterial={fetchAllMaterial}
                  />
                ) : null
              }
              items={items}
            />
          </ConfigProvider>
        </div>

        <div className={cx("project-detail-search")}>
          <div className="flex w-full justify-between items-center">
            <div className={cx("search-box-container")}>
              <div className={cx("search-box")}>
                {/* <SearchOutlined color='#285D9A' size={20} /> */}
                <input
                  type="search"
                  placeholder="Tìm kiếm tài liệu"
                  className={cx("search-input")}
                  onChange={(e) => handleInputSearch(e)}
                />
              </div>
              <button className={cx("search-button")}>
                <SearchOutlined
                  color="white"
                  size={20}
                  style={{ marginRight: "5px" }}
                />
                Tìm kiếm
              </button>
            </div>
            {user.roleId === 4 && (
              <div>
                <Button
                  variant="contained"
                  className="w-max"
                  startIcon={
                    <AddCircleOutlineOutlined style={{ color: "white" }} />
                  }
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#474D57",
                    padding: "10px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={handleCreateOpen}
                >
                  Tạo mới
                </Button>
              </div>
            )}
          </div>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#474D57",
                headerColor: "white",
              },
            },
          }}
        >
          <Table
            size="large"
            columns={columns}
            dataSource={materialList}
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
            scroll={{ x: "max-content" }}
          />
        </ConfigProvider>
      </div>

      {/* Thêm tài liệu mới */}
      <Dialog open={openCreate} onClose={handleCreateClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Thêm tài liệu mới
        </DialogTitle>
        <form
          style={{ width: "400px" }}
          onSubmit={handleSubmit(onSubmitCreate)}
        >
          <DialogContent>
            {/* Nhập tiêu đề tài liệu */}
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Vui lòng nhập tiêu đề",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ marginBottom: 10 }}
                  label="Tiêu đề"
                  fullWidth
                  required
                  margin="normal"
                  type="text"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            {/* Chọn file tải lên */}
            <Controller
              name="file"
              control={control}
              rules={{
                required: "Vui lòng chọn tệp",
              }}
              render={({ field: { onChange, ref } }) => (
                <div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    required
                    ref={ref}
                    onChange={(e) => {
                      handleFileChange(e); // để xử lý logic custom của bạn
                      onChange(e.target.files[0]); // để cập nhật giá trị vào react-hook-form
                    }}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained"
                      component="span"
                      style={{ marginTop: 10 }}
                      sx={{ textTransform: "none" }}
                      startIcon={<UploadFileOutlined />}
                    >
                      Nhấn vào để upload
                    </Button>
                  </label>
                  {selectedMaterial && (
                    <p style={{ marginTop: 10 }}>{selectedMaterial.name}</p>
                  )}
                  {errors.file && (
                    <p style={{ color: "red", fontSize: 14 }}>
                      {errors.file.message}
                    </p>
                  )}
                </div>
              )}
            />
          </DialogContent>

          <DialogActions>
            <Button
              style={{
                backgroundColor: "#d45b13",
                color: "white",
                border: "none",
                padding: "10px 7px",
                marginRight: "5px",
              }}
              variant="outlined"
              onClick={handleCreateClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleUpload}
              variant="contained"
              style={{
                backgroundColor: "#00b300",
                color: "white",
                border: "none",
                padding: "10px 7px",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Tạo mới"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Cập nhật tài liệu */}
      <Dialog open={openUpdate} onClose={handleUpdateClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Cập nhật tài liệu
        </DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmitUpdate)}
          style={{ width: "400px" }}
        >
          <DialogContent>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Vui lòng tiêu đề",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ marginBottom: 10 }}
                  label="Tiêu đề"
                  fullWidth
                  margin="dense"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="file"
              control={control}
              rules={{
                required: "Vui lòng chọn tệp",
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <div>
                  <input
                    {...field}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      handleFileChange(e); // để xử lý logic custom của bạn
                      onChange(e.target.files[0]); // để cập nhật giá trị vào react-hook-form
                    }}
                    style={{ display: "none" }}
                    id="file-update"
                  />
                  <label htmlFor="file-update">
                    <Button
                      variant="contained"
                      component="span"
                      style={{ marginTop: 10 }}
                      sx={{ textTransform: "none" }}
                      startIcon={<UploadFileOutlined />}
                    >
                      Nhấn vào để upload
                    </Button>
                  </label>
                  {selectedMaterial && (
                    <p style={{ marginTop: 10 }}>{selectedMaterial.name}</p>
                  )}
                  {errors.file && (
                    <p style={{ color: "red", marginTop: 5 }}>
                      {errors.file.message}
                    </p>
                  )}
                </div>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleUpdateClose}
              style={{
                backgroundColor: "#d45b13",
                color: "white",
                border: "none",
                padding: "10px 7px",
                marginRight: "5px",
              }}
              variant="outlined"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleUpload}
              style={{
                backgroundColor: "#00b300",
                color: "white",
                border: "none",
                padding: "10px 7px",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Xóa */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle style={{ backgroundColor: "#474D57", color: "white" }}>
          Xác nhận xóa tài liệu
        </DialogTitle>
        <DialogContent>
          <p className="pt-3 pb-3">Bạn có chắc muốn xóa tài liệu này?</p>
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
