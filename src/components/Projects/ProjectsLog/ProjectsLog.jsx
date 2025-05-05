import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import { SearchOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
import useAuth from "../../../hooks/useAuth";
import classes from "./ProjectsLog.module.css";
import classNames from "classnames/bind";
import { Spinner } from "../../Spinner/Spinner";
import { getProjectLog } from "../../../services/ProjectsApi";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const cx = classNames.bind(classes);

export const ProjectsLog = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [originalProjectLog, setOriginalProjectLog] = useState([]); // Dữ liệu gốc từ API
  const [filteredProjectLog, setFilteredProjectLog] = useState([]); // Dữ liệu sau khi lọc
  const [dateRange, setDateRange] = useState([]); // Lưu khoảng ngày được chọn
  const [searchValue, setSearchValue] = useState("");
  const [totalItem, setTotalItem] = useState(0);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpand = (recordId) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(recordId)) {
        newExpandedRows.delete(recordId); // Đóng nếu đã mở
      } else {
        newExpandedRows.add(recordId); // Mở nếu chưa mở
      }
      return newExpandedRows;
    });
  };

  const fetchAllLogOfProject = useCallback(async () => {
    const response = await getProjectLog(
      projectId,
      searchValue,
      pageNumber,
      rowsPerPage
    );
    const responseData = await response.json();

    if (response.ok) {
      const logs = responseData.result.getAllProjectLoggingDTOs;
      setOriginalProjectLog(logs); // Lưu dữ liệu gốc
      setFilteredProjectLog(logs); // Ban đầu hiển thị toàn bộ
      setTotalItem(responseData.result.totalCount);
      // setPageNumber(responseData.result.currentPage);
    } else {
      setOriginalProjectLog([]); // Lưu dữ liệu gốc
      setFilteredProjectLog([]); // Ban đầu hiển thị toàn bộ
      setTotalItem(0);
      setPageNumber(1);
      console.log("Lỗi khi lấy log dự án");
    }
  }, [pageNumber, projectId, searchValue, rowsPerPage]);

  useEffect(() => {
    if (projectId) {
      fetchAllLogOfProject();
    }
  }, [fetchAllLogOfProject, projectId]);

  const handleInputSearch = debounce((value) => {
    setSearchValue(value);
    setPageNumber(1); // Reset về trang đầu tiên khi tìm kiếm
  }, 500);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Sử dụng định dạng 24h
    }).format(date);
  };
  const convertToISODate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const filterLogsByDate = (dates, dateStrings) => {
    if (!dates || dateStrings[0] === "" || dateStrings[1] === "") {
      setFilteredProjectLog(originalProjectLog);
      setDateRange([]);
      return;
    }

    setDateRange(dateStrings);
    const [startDate, endDate] = dateStrings;

    const start = new Date(convertToISODate(startDate)).setHours(0, 0, 0, 0);
    const end = new Date(convertToISODate(endDate)).setHours(23, 59, 59, 999);

    // Lọc log theo khoảng thời gian
    const filteredLogs = originalProjectLog.filter((log) => {
      const logDate = new Date(log.actionDate).getTime();
      return logDate >= start && logDate <= end;
    });

    if (filteredLogs.length === 0) {
      // Nếu không có dữ liệu, cập nhật danh sách rỗng
      setFilteredProjectLog([]);
    } else {
      setFilteredProjectLog(filteredLogs);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "projectNoteId",
      key: "projectNoteId",
      align: "center",
      render: (_, __, index) => index + 1 + (pageNumber - 1) * rowsPerPage,
    },
    {
      title: "Ngày thực hiện",
      dataIndex: "actionDate",
      key: "actionDate",
      align: "center",
      render: (text) => {
        return formatDate(text);
      },
    },
    {
      title: "Thành viên",
      dataIndex: "account",
      key: "account",
      align: "center",
      render: (account) => {
        return `${account.fullName} - ${account.accountCode}`;
      },
    },
    {
      title: "Hành động",
      dataIndex: "actionContent",
      key: "actionContent",
      align: "center",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => toggleExpand(record.projectNoteId)}
        >
          {!expandedRows.has(record.projectNoteId) ? (
            <EyeInvisibleOutlined
              style={{ fontSize: "16px", fontWeight: 600 }}
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
    // {
    //     title: 'Ghi chú',
    //     dataIndex: 'noteContent',
    //     key: 'noteContent',
    //     align: 'center',
    //     render: (text, record) => {
    //         if (!text) return <span>-</span>;
    //         return (
    //             <div style={{ cursor: "pointer" }} onClick={() => toggleExpand(record.projectNoteId)}>
    //                 {!expandedRows.has(record.projectNoteId) ? (
    //                     <EyeInvisibleOutlined style={{ fontSize: "16px", fontWeight: "bold" }} />
    //                 ) : (
    //                     <p style={{ textAlign: "left" }}>
    //                         {text.split("\n").map((line, index) => (
    //                             <span key={index}>
    //                                 {line}
    //                                 <br />
    //                             </span>
    //                         ))}
    //                     </p>
    //                 )}
    //             </div>
    //         );
    //     },
    // }
  ];

  if (!user || !projectId) {
    return <Spinner />;
  }

  return (
    <div className={cx("project-log-table-container")}>
      <h2 className={cx("project-log-title")}>Danh sách log</h2>
      <div className={cx("project-log-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            {/* <SearchOutlined color="#285D9A" size={20} /> */}
            <input
              type="search"
              placeholder="Tìm kiếm phần log"
              className={cx("search-input")}
              onChange={(e) => handleInputSearch(e.target.value)}
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
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#285D9A",
                colorPrimaryBorder: "#474D57",
              },
            }}
          >
            <RangePicker
              size="large"
              style={{ height: "45px", borderRadius: "15px" }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              allowClear={true}
              onChange={filterLogsByDate}
            />
          </ConfigProvider>
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
          rowKey={(record) => record.projectNoteId} // Đảm bảo giá trị này là duy nhất
          dataSource={filteredProjectLog}
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
  );
};
