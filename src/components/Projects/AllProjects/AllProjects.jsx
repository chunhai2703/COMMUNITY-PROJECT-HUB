import React, { useState, useEffect } from "react";
import classes from "./AllProjects.module.css";
import classNames from "classnames/bind";
import { SearchOutlined } from "@ant-design/icons";
import { ProjectsList } from "./ProjectsList/ProjectsList";
import { ProjectCreateForm } from "../../Popup/Project/ProjectCreateForm";

const cx = classNames.bind(classes);

export const AllProjects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);

  // Hàm gọi API để lấy danh sách dự án theo từ khóa tìm kiếm
  const fetchProjects = async (searchQuery = "") => {
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
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");

      const resData = await response.json();
      setProjects(resData.result);
    } catch (error) {
      console.error("Lỗi lấy dự án:", error);
    }
  };

  // Gọi API khi component được mount để lấy danh sách ban đầu
  useEffect(() => {
    fetchProjects();
  }, []);

  // Theo dõi searchValue, nếu rỗng thì tự động lấy tất cả dự án
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchValue.trim() === "") {
        fetchProjects();
      }
    }, 500); // Tránh spam API, chờ 500ms

    return () => clearTimeout(delaySearch);
  }, [searchValue]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchProjects(searchValue);
  };

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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Nhấn Enter để tìm kiếm
            />
          </div>
          <button className={cx("search-button")} onClick={handleSearch}>
            <SearchOutlined color="white" size={20} style={{ marginRight: "5px" }} />
            Tìm kiếm
          </button>
        </div>

        <ProjectCreateForm />
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
};
