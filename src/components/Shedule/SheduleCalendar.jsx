import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"; // Thêm plugin này

const TimeTableCalendar = () => {
  // Dữ liệu thời khóa biểu với giờ cụ thể
  const events = [
    { title: "Math", start: "2025-03-18T08:00:00", end: "2025-03-18T09:30:00" },
    { title: "English", start: "2025-03-18T10:00:00", end: "2025-03-18T11:30:00" },
    { title: "Science", start: "2025-03-19T08:00:00", end: "2025-03-19T09:30:00" },
    { title: "History", start: "2025-03-19T10:00:00", end: "2025-03-19T11:30:00" },
    { title: "Physics", start: "2025-03-20T08:00:00", end: "2025-03-20T09:30:00" },
    { title: "Chemistry", start: "2025-03-21T08:00:00", end: "2025-03-21T09:30:00" },
    { title: "Computer Science", start: "2025-03-22T08:00:00", end: "2025-03-22T09:30:00" },
  ];

  return (
    <div>
      <h2>Weekly Time Table (Calendar View)</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]} // Thêm timeGridPlugin
        initialView="timeGridWeek" // Hiển thị lịch theo tuần với giờ
        events={events}
      />
    </div>
  );
};

export default TimeTableCalendar;
