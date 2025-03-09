import React, { useState, useEffect, useCallback } from 'react'
import classes from "./AllAvailableProjects.module.css";
import classNames from "classnames/bind";
import { SearchOutlined } from "@ant-design/icons";
import { ProjectsList } from "./ProjectsList/ProjectsList";
import useAuth from '../../../hooks/useAuth';
import { Spinner } from '../../Spinner/Spinner';


const cx = classNames.bind(classes);

export const AllAvailableProjects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  // Hàm gọi API để lấy danh sách dự án theo từ khóa tìm kiếm
  const fetchProjects = useCallback(async (searchQuery = "") => {
    try {
      const response = await fetch(
        `http://localhost:5145/api/Project/available-project?userId=${user.accountId}&searchValue=${searchQuery}`,
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
        throw new Response(
          JSON.stringify({ message: resData.message }),
          {
            status: resData.statusCode,
          }
        );
      }
      setProjects(resData.result);

    } catch (error) {
      console.error("Lỗi khi lấy dự án:", error);
      throw error; // Ném lỗi để component xử lý
    }
  }, [user?.accountId]);

  useEffect(() => {
    if (user && user.accountId) {
      fetchProjects();
    }
  }, [fetchProjects, user]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchValue.trim() === "") {
        fetchProjects();
      }
    }, 500); 

    return () => clearTimeout(delaySearch);
  }, [searchValue, fetchProjects]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchProjects(searchValue);
  };

  if (!user || !user.accountId) {
    return <Spinner />;
  }


  return (
    <div className={cx("all-available-projects-container")}>
      <h2 className={cx("all-available-projects-title")}>Dự Án Cộng Đồng</h2>
      <div className={cx("all-available-projects-search")}>
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
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
}
