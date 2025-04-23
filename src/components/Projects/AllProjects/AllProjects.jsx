import React, { useState, useEffect, useCallback } from "react";
import classes from "./AllProjects.module.css";
import classNames from "classnames/bind";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { ProjectsList } from "./ProjectsList/ProjectsList";
import { ProjectCreateForm } from "../../Popup/Project/ProjectCreateForm";
import { Spinner } from "../../Spinner/Spinner";
import { Select } from "antd";
import useAuth from "../../../hooks/useAuth";

const cx = classNames.bind(classes);
const baseUrl = process.env.REACT_APP_API_URL;

export const AllProjects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterOrder, setFilterOrder] = useState("");
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(
    async (searchQuery = "", filterField = "", filterOrder = "") => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/api/Project/all-project?searchValue=${searchQuery}&filterField=${filterField}&filterOrder=${filterOrder}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || "Lỗi khi lấy danh sách dự án");
        }

        setProjects(resData.result);
      } catch (error) {
        console.error("Lỗi khi lấy dự án:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Gọi API khi component được mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Debounce khi thay đổi searchValue
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProjects(searchValue);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchValue, fetchProjects]);

  const handleFilter = useCallback(() => {
    if (filterField && filterOrder) {
      fetchProjects("", filterField, filterOrder);
    } else {
      alert("Vui lòng chọn cả trường lọc và thứ tự lọc!");
    }
  }, [fetchProjects, filterField, filterOrder]);

  useEffect(() => {
    if (filterField && filterOrder) {
      handleFilter();
    }
  }, [filterField, filterOrder, handleFilter]);

  return (
    <div className={cx("all-projects-container")}>
      <h2 className={cx("all-projects-title")}>Dự Án Cộng Đồng</h2>
      <div className={cx("all-projects-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            <SearchOutlined color="#285D9A" size={20} />
            <input
              type="search"
              placeholder="Tìm kiếm dự án"
              className={cx("search-input")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProjects(searchValue)}
            />
          </div>
          {/* <button className={cx("search-button")} onClick={() => fetchProjects(searchValue)}>
            <SearchOutlined color="white" size={20} style={{ marginRight: "5px" }} />
            Tìm kiếm
          </button> */}

          <Select
            size="large"
            variant="outlined"
            suffixIcon={<FilterOutlined />}
            style={{
              width: 250,
            }}
            placeholder="Trường lọc"
            optionFilterProp="label"
            options={[
              {
                value: "Title",
                label: "Tên dự án",
              },
              {
                value: "StartDate",
                label: "Ngày bắt đầu lớp học",
              },
              {
                value: "EndDate",
                label: "Ngày kết thúc lớp học",
              },
              {
                value: "CreatedDate",
                label: "Ngày tạo",
              },
            ]}
            value={filterField || undefined}
            onChange={(value) => setFilterField(value)}
          />

          <Select
            size="large"
            variant="outlined"
            suffixIcon={<FilterOutlined />}
            style={{
              width: 150,
            }}
            placeholder="Thứ tự lọc"
            optionFilterProp="label"
            options={[
              {
                value: "ASC",
                label: "Tăng dần",
              },
              {
                value: "DESC",
                label: "Giảm dần",
              },
            ]}
            value={filterOrder || undefined}
            onChange={(value) => setFilterOrder(value)}
          />
        </div>
        {user && user?.roleId === 4 && (
          <ProjectCreateForm refresh={fetchProjects} />
        )}
      </div>

      <ProjectsList projects={projects} />
    </div>
  );
};
