import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { DatePicker, Divider, Tag, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN"; // Import locale tiếng Việt cho Ant Design
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import ngôn ngữ tiếng Việt cho dayjs

import classes from "./ScheduleCalendar.module.css";
import classNames from "classnames/bind";
import useAuth from "../../hooks/useAuth";
import { getSchedule } from "../../services/ScheduleApi";
import { toast } from "react-toastify";
import { Spinner } from "../Spinner/Spinner";

dayjs.locale("vi"); // Cài đặt ngôn ngữ cho dayjs

const cx = classNames.bind(classes);

export default function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = useState(null); // 🟢 Mặc định là tháng/năm hiện tại
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchScheduleData = useCallback(async () => {
    if (!user || !user.accountId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getSchedule(user.accountId);

      if (response.isSuccess) {
        // Chuyển đổi dữ liệu từ API thành format của FullCalendar
        const formattedEvents = response.result.map((lesson) => ({
          title: lesson.projectName, // Tiêu đề sự kiện
          start: lesson.startTime, // Thời gian bắt đầu
          end: lesson.endTime, // Thời gian kết thúc
          extendedProps: {
            room: lesson.room, // Thông tin phòng học
          },
        }));

        console.log("📅 Dữ liệu đã format:", formattedEvents); // 📌 Thêm log kiểm tra
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thời khóa biểu:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  if (!user || loading) {
    return <Spinner />;
  }

  // 🟢 Dữ liệu thời khóa biểu
  // const events = [
  //   { title: "💻 Hành trình số hóa nhân tạo", start: "2025-03-18T08:00:00", end: "2025-03-18T09:30:00", room: "401" },
  //   { title: "💻 Hành trình số hóa nhân tạo", start: "2025-01-10T08:00:00", end: "2025-01-10T09:30:00", room: "401" },
  //   { title: "💻 Hành trình số hóa nhân tạo", start: "2025-01-20T08:00:00", end: "2025-01-20T09:30:00", room: "401" },
  //   { title: "English", start: "2025-03-18T10:00:00", end: "2025-03-18T11:30:00", room: "401" },
  //   { title: "Science", start: "2025-03-19T08:00:00", end: "2025-03-19T09:30:00", room: "401" },
  //   { title: "History", start: "2025-03-19T10:00:00", end: "2025-03-19T11:30:00", room: "401" },
  //   { title: "Physics", start: "2025-04-05T08:30:00", end: "2025-04-05T09:30:00", room: "401" },
  //   { title: "Chemistry", start: "2025-04-10T08:00:00", end: "2025-04-10T09:30:00", room: "401" },
  //   { title: "Computer Science", start: "2025-05-15T08:00:00", end: "2025-05-15T09:30:00", room: "401" },
  // ];

  // 🟢 Lọc sự kiện đúng cách
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = dayjs(event.start).startOf("day");
        return (
          eventDate.year() === selectedDate.year() &&
          eventDate.month() === selectedDate.month()
        );
      })
    : events;

  console.log("📆 Sự kiện hiển thị:", filteredEvents); // 📌 Kiểm tra danh sách sự kiện được truyền vào FullCalendar

  // 🟢 Xử lý khi chọn tháng
  const handleDateChange = (date) => {
    setSelectedDate(date ? dayjs(date) : null);
  };

  return (
    <div className={cx("schedule-calendar-container")}>
      <div className={cx("schedule-calendar-header")}>
        <h2 className={cx("schedule-calendar-title")}>Thời khóa biểu</h2>

        {/* Bộ lọc DatePicker */}

        <ConfigProvider locale={viVN}>
          <DatePicker
            size="large"
            onChange={handleDateChange}
            picker="month"
            value={selectedDate}
            format="MM/YYYY"
            placeholder="Chọn Tháng/Năm"
            style={{ width: "100%", maxWidth: "200px" }}
          />
        </ConfigProvider>
      </div>

      <div className={cx("schedule-calendar-content")}>
        {/* FullCalendar hiển thị các sự kiện đã lọc */}
        <FullCalendar
          key={selectedDate ? selectedDate.format("YYYY-MM") : "default"}
          initialDate={
            selectedDate
              ? selectedDate.format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD")
          }
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          locale={viLocale}
          events={filteredEvents}
          eventContent={renderEventContent}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridWeek,dayGridMonth",
          }}
          selectable={true}
          // selectMirror={true}
          dayMaxEvents={true}
          eventResizableFromStart={true}
          aspectRatio={2} // Giá trị lớn hơn sẽ làm cột rộng hơn
          expandRows={true}
          // height={600}
          // contentHeight={600}
          dayMaxEventRows={2} // Hiển thị nhiều sự kiện hơn trên một ngày
          moreLinkText={(num) => `+ Xem ${num} sự kiện`} // 🔄 Sửa đổi nội dung của link "thêm"
        />
      </div>
    </div>
  );
}

// ✅ Hiển thị thông tin sự kiện
function renderEventContent(eventInfo) {
  console.log("📌 Thông tin sự kiện:", eventInfo.event); // 📌 Thêm log kiểm tra dữ liệu

  return (
    <div className={cx("custom-event-content")}>
      <p className={cx("event-title")}>
        {eventInfo.event.title || "Không có tiêu đề"}
      </p>
      <p className={cx("event-room")}>
        Phòng học: {eventInfo.event.extendedProps?.room || "Chưa có thông tin"}
      </p>
      <Tag className={cx("event-time")} color="#108ee9">
        {eventInfo.event.start
          ? dayjs(eventInfo.event.start).format("HH:mm")
          : "??:??"}{" "}
        -{" "}
        {eventInfo.event.end
          ? dayjs(eventInfo.event.end).format("HH:mm")
          : "??:??"}
      </Tag>
    </div>
  );
}
