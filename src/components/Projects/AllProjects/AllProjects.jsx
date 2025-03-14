import React, { useState, useEffect, useCallback } from "react";
import classes from "./AllProjects.module.css";
import classNames from "classnames/bind";
import { SearchOutlined } from "@ant-design/icons";
import { ProjectsList } from "./ProjectsList/ProjectsList";
import { ProjectCreateForm } from "../../Popup/Project/ProjectCreateForm";

const cx = classNames.bind(classes);

export const AllProjects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5145/api/Project/all-project?searchValue=${searchQuery}`,
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
  }, []);

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
          <button className={cx("search-button")} onClick={() => fetchProjects(searchValue)}>
            <SearchOutlined color="white" size={20} style={{ marginRight: "5px" }} />
            Tìm kiếm
          </button>
        </div>

        <ProjectCreateForm />
      </div>

      {loading ? <p>Đang tải dữ liệu...</p> : <ProjectsList projects={projects} />}
    </div>
  );
};
