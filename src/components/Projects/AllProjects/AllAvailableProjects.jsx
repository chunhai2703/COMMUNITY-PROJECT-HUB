import React, { useState, useEffect, useCallback, useRef } from "react";
import classes from "./AllAvailableProjects.module.css";
import classNames from "classnames/bind";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { ProjectsList } from "./ProjectsList/ProjectsList";
import useAuth from "../../../hooks/useAuth";
import { Spinner } from "../../Spinner/Spinner";
import { Select } from "antd";

const cx = classNames.bind(classes);

export const AllAvailableProjects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [filterField, setFilterField] = useState("");
  const [filterOrder, setFilterOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const debounceRef = useRef(null);

  // Hàm fetch dự án từ API
  const fetchProjects = useCallback(async (searchQuery = "", filterField = "", filterOrder = "") => {
    if (!user?.accountId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://communityprojecthubdemo.azurewebsites.net/api/Project/available-project?userId=${user.accountId}&searchValue=${searchQuery}&filterField=${filterField}&filterOrder=${filterOrder}`,
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
      setError(error.message || "Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  }, [user?.accountId]);

  // Gọi API khi component được mount (chỉ khi user đã có accountId)
  useEffect(() => {
    if (user?.accountId) {
      fetchProjects();
    }
  }, [fetchProjects, user]);

  // Debounce khi searchValue thay đổi
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchProjects(searchValue);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue, fetchProjects]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchProjects(searchValue);
  };

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

  if (!user || !user.accountId) {
    return <Spinner />;
  }

  return (
    <div className={cx("all-available-projects-container")}>
      <h2 className={cx("all-available-projects-title")}>Dự Án Cộng Đồng</h2>

      <div className={cx("all-available-projects-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            <input
              type="search"
              placeholder="Tìm kiếm dự án"
              className={cx("search-input")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button className={cx("search-button")} onClick={handleSearch}>
            <SearchOutlined color="white" size={20} style={{ marginRight: "5px" }} />
            Tìm kiếm
          </button>
        </div>
        <div className={cx("filter-container")}>
          <Select
            size="large"
            variant="outlined"
            suffixIcon={<FilterOutlined />}
            style={{
              width: 150,
            }}
            placeholder="Trường lọc"
            optionFilterProp="label"
            options={[
              {
                value: 'Title',
                label: 'Tên dự án',
              },
              {
                value: 'StartDate',
                label: 'Ngày bắt đầu',
              },
              {
                value: 'EndDate',
                label: 'Ngày kết thúc',
              },
              {
                value: 'CreatedDate',
                label: 'Ngày tạo',
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
                value: 'ASC',
                label: 'Tăng dần',
              },
              {
                value: 'DESC',
                label: 'Giảm dần',
              },
            ]}
            value={filterOrder || undefined}
            onChange={(value) => setFilterOrder(value)}
          />
        </div>

      </div>

      <ProjectsList projects={projects} />
    </div>
  );
};
