import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Table, Tag } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeInvisibleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
import useAuth from "../../../hooks/useAuth";
import classes from "./RegistrationTable.module.css";
import classNames from "classnames/bind";
import { Spinner } from "../../Spinner/Spinner";
import { RegistApproveForm } from "../../Popup/Registration/RegistApproveForm";
import { RegistRejectForm } from "../../Popup/Registration/RegistRejectForm";
import { GetAllRegistrationOfProject } from "../../../services/RegistrationApi";
import { render } from "@fullcalendar/core/preact.js";

const cx = classNames.bind(classes);

export const RegistrationTable = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [registrationList, setRegistrationList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [totalItem, setTotalItem] = useState(0);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpand = (recordId) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(recordId)) {
        newExpandedRows.delete(recordId);
      } else {
        newExpandedRows.add(recordId);
      }
      return newExpandedRows;
    });
  };

  const fetchAllClassesOfProject = useCallback(async () => {
    const response = await GetAllRegistrationOfProject(
      projectId,
      searchValue,
      pageNumber,
      rowsPerPage
    );
    const responseData = await response.json();

    if (response.ok) {
      setRegistrationList(responseData.result.registrations);
      setTotalItem(responseData.result.totalCount);
      setPageNumber(responseData.result.currentPage);
    } else {
      setRegistrationList([]);
      setTotalItem(0);
      setPageNumber(1);
      console.log("Lỗi khi lấy danh sách đơn đăng kí ");
    }
  }, [projectId, searchValue, pageNumber, rowsPerPage]);

  const handleInputSearch = debounce((e) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  }, 500);

  useEffect(() => {
    if (projectId) {
      fetchAllClassesOfProject();
    }
  }, [fetchAllClassesOfProject, projectId]);

  const columns = [
    {
      title: "STT",
      dataIndex: "registrationId",
      key: "registrationId",
      render: (_, __, index) => index + 1 + (pageNumber - 1) * rowsPerPage,
    },
    {
      title: "Lớp",
      dataIndex: "classCode",
      key: "classCode",
      align: "center",
    },
    {
      title: "Thành viên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Mã thành viên",
      dataIndex: "accountCode",
      key: "accountCode",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => toggleExpand(record.registrationId)}
        >
          {!expandedRows.has(record.registrationId) ? (
            <EyeInvisibleOutlined
              style={{ fontSize: "16px", fontWeight: "bold" }}
            />
          ) : (
            <p style={{ textAlign: "left" }}>
              {text.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Tình trạng",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (text) =>
        text === "Đã duyệt" ? (
          <Tag
            icon={<CheckCircleOutlined style={{ verticalAlign: "middle" }} />}
            color="success"
          >
            {text}
          </Tag>
        ) : text === "Đang chờ duyệt" ? (
          <Tag
            icon={<SyncOutlined spin style={{ verticalAlign: "middle" }} />}
            color="processing"
          >
            {text}
          </Tag>
        ) : text === "Từ chối" ? (
          <Tag
            icon={<CloseCircleOutlined style={{ verticalAlign: "middle" }} />}
            color="error"
          >
            {text}
          </Tag>
        ) : (
          <Tag
            icon={<MinusCircleOutlined style={{ verticalAlign: "middle" }} />}
            color="red"
          >
            {text}
          </Tag>
        ),
    },
    {
      title: "Lý do từ chối",
      dataIndex: "deniedReason",
      key: "deniedReason",
      align: "center",
      render: (text, record) =>
        record.status === "Từ chối" ? (
          <p style={{ textAlign: "left" }}>{text}</p>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "",
      key: "action",
      render: (record) =>
        record.status === "Đang chờ duyệt" ? (
          <div className={cx("action-icon")}>
            <RegistApproveForm
              registrationId={record.registrationId}
              refreshTable={fetchAllClassesOfProject}
            />
            <RegistRejectForm
              registrationId={record.registrationId}
              refreshTable={fetchAllClassesOfProject}
            />
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              fontWeight: "400",
              color: "#368aea",
            }}
          >
            Đơn đăng kí đã được xử lý
          </p>
        ),
    },
  ];

  if (!user || !projectId) {
    return <Spinner />;
  }

  return (
    <div className={cx("project-registration-table-container")}>
      <div className={cx("project-registration-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            <SearchOutlined color="#285D9A" size={20} />
            <input
              type="search"
              placeholder="Tìm kiếm đơn đăng ký"
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
          rowKey={(record) => record.registrationId}
          dataSource={registrationList}
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
        />
      </ConfigProvider>
    </div>
  );
};
