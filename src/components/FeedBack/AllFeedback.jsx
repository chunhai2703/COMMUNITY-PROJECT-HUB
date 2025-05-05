import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import { useParams } from "react-router-dom";

import classNames from "classnames/bind";
import classes from "./AllFeedback.module.css";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "../Spinner/Spinner";
import { getAllFeedbackOfProject } from "../../services/FeedbackApi";

import dayjs from "dayjs"; // Bạn cần cài: npm install dayjs
import { render } from "@fullcalendar/core/preact.js";

const cx = classNames.bind(classes);

export const AllFeedback = () => {
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);

  const fetchAllFeedback = useCallback(async () => {
    setLoading(true);
    const response = await getAllFeedbackOfProject(projectId);
    if (response.isSuccess) {
      setFeedbackList(response.result);
    } else {
      console.error("Lỗi khi lấy các đánh giá của dự án:", response.message);
      setFeedbackList([]);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    if (user) {
      fetchAllFeedback();
    }
  }, [fetchAllFeedback, user]);

  const getUniqueQuestions = (feedbackList) => {
    const questionMap = new Map();
    feedbackList.forEach((feedback) => {
      feedback.traineeFeedbackAnswers.forEach((answer) => {
        if (!questionMap.has(answer.questionId)) {
          questionMap.set(answer.questionId, {
            questionId: answer.questionId,
            questionContent: answer.questionContent,
          });
        }
      });
    });
    return Array.from(questionMap.values());
  };

  const uniqueQuestions = getUniqueQuestions(feedbackList);

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center",
      render: (_, __, index) => index + 1 + (pageNumber - 1) * ITEMS_PER_PAGE,
    },
    {
      title: "Thời gian",
      dataIndex: "feedbackCreatedDate",
      key: "feedbackCreatedDate",
      align: "center",
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm:ss") : "—",
    },
    {
      title: "Mã học viên",
      dataIndex: "traineeAccountCode",
      key: "traineeAccountCode",
      align: "center",
    },
    {
      title: "Học viên",
      dataIndex: "traineeName",
      key: "traineeName",
      align: "center",
    },
    ...uniqueQuestions.map((q) => ({
      title: q.questionContent,
      dataIndex: q.questionId,
      key: q.questionId,
      align: "center",
    })),
    {
      title: "Ý kiến khác",
      dataIndex: "feedbackContent",
      key: "feedbackContent",
      align: "center",
      render: (value) => value || "—",
    },
  ];

  const formattedData = feedbackList.map((item) => {
    const answerMap = {};
    item.traineeFeedbackAnswers.forEach((ans) => {
      answerMap[ans.questionId] = ans.answerContent;
    });

    return {
      traineeId: item.traineeId,
      traineeAccountCode: item.traineeAccountCode,
      traineeName: item.traineeName,
      feedbackContent: item.feedbackContent,
      feedbackCreatedDate: item.feedbackCreatedDate,
      ...answerMap,
    };
  });

  if (!user || loading || !feedbackList) {
    return <Spinner />;
  }

  return (
    <div className={cx("all-feedback-container")}>
      <h2 className={cx("all-feedback-title")}>Danh sách các đánh giá dự án</h2>

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
          rowKey={(record) => record.traineeId}
          dataSource={formattedData}
          pagination={{
            position: ["bottomCenter"],
            current: pageNumber,
            pageSize: ITEMS_PER_PAGE,
            total: feedbackList.length,
            onChange: (page) => setPageNumber(page),
          }}
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </div>
  );
};
