import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Dropdown, Table } from "antd";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import classes from "./FeedbackManagement.module.css";
import classNames from "classnames/bind";
import { FeedbackUpdateForm } from "../Popup/FeedbackForm/FeedbackUpdateForm";
import { FeedbackDeleteForm } from "../Popup/FeedbackForm/FeedbackDeleteForm";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { FeedbackCreateForm } from "../Popup/FeedbackForm/FeedbackCreateForm";
import { getAllQuestionOfProject } from "../../services/FeedbackApi";

const cx = classNames.bind(classes);

export const FeedbackManage = () => {
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const fetchAllQuestionOfProject = useCallback(async (search = "") => {
    try {
      setLoading(true);
      const response = await getAllQuestionOfProject(search);

      if (response.isSuccess) {
        setQuestionList(response.result || []);
      } else {
        setQuestionList([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy các câu hỏi:", error);
      setQuestionList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchValue) {
      const delaySearch = setTimeout(() => {
        fetchAllQuestionOfProject(searchValue);
      }, 500);

      return () => clearTimeout(delaySearch);
    } else {
      fetchAllQuestionOfProject();
    }
  }, [searchValue, fetchAllQuestionOfProject]);

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchAllQuestionOfProject(searchValue);
  };

  const getMenuItems = (record) => [
    {
      key: "1",
      label: (
        <FeedbackUpdateForm
          question={record}
          refresh={fetchAllQuestionOfProject}
        />
      ),
    },
    {
      key: "2",
      label: (
        <FeedbackDeleteForm
          question={record}
          refresh={fetchAllQuestionOfProject}
        />
      ),
    },
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "questionId",
      key: "questionId",
      align: "center",
      render: (_, __, index) => index + 1 + (pageNumber - 1) * ITEMS_PER_PAGE,
    },
    {
      title: "Câu hỏi",
      dataIndex: "questionContent",
      key: "questionContent",
      align: "center",
    },
    {
      title: "Đáp án",
      key: "anwserList",
      dataIndex: "anwserList",
      align: "center",
      render: (_, record) => (
        <ol className={cx("answer-list")}>
          {record.anwserList.map((answer) => (
            <li className={cx("answer-item")} key={answer.answerId}>
              {answer.answerContent}
            </li>
          ))}
        </ol>
      ),
    },
    {
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
    },
  ];

  if (!user || loading) {
    return <Spinner />;
  }

  return (
    <div className={cx("feedback-management-container")}>
      <h2 className={cx("feedback-management-title")}>
        Danh sách câu hỏi đánh giá
      </h2>
      <div className={cx("feedback-management-search")}>
        <div className={cx("search-box-container")}>
          <div className={cx("search-box")}>
            <input
              type="search"
              placeholder="Tìm kiếm câu hỏi"
              className={cx("search-input")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
        <FeedbackCreateForm refresh={fetchAllQuestionOfProject} />
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
          rowKey={(record) => record.questionId}
          dataSource={questionList}
          pagination={{
            position: ["bottomCenter"],
            current: pageNumber,
            pageSize: ITEMS_PER_PAGE,
            total: questionList.length,
            onChange: (page) => setPageNumber(page),
          }}
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </div>
  );
};
