'use client';
import AddNewAttendance from '@/components/AddNewAttendance';
import AttendanceSummaryTable from '@/components/AttendanceSummaryTable';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export default function Attendance() {
  const { courseId } = useParams();
  const [selectedTab, setSelectedTab] = useState(<AttendanceSummaryTable courseId={courseId as string} />);

  return (
    <div className="flex m-4 gap-2 h-[1000px]">
      <nav className="w-[15%] flex flex-col gap-2 border-r-2 pr-2 sticky top-20 self-start">
        <button
          onClick={() => setSelectedTab(<AttendanceSummaryTable courseId={courseId as string} />)}
          className="border py-2 px-2 bg-blue-200 rounded-xl hover:bg-blue-300"
        >
          Attendance Summary
        </button>
        <button
          onClick={() => setSelectedTab(<AddNewAttendance courseId={courseId as string} />)}
          className="border py-2 px-2 bg-blue-200 rounded-xl hover:bg-blue-300"
        >
          Add
        </button>
      </nav>
      <div className="w-[85%]">{selectedTab}</div>
    </div>
  );
}
