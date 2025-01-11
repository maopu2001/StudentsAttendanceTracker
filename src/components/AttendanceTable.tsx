'use client';
import React, { Dispatch } from 'react';
import StudentAttendanceRow from './StudentAttendanceRow';

type StudentStatus = {
  attendanceId: string | null;
  studentId: string;
  name: string;
  regNo: string;
  status: string;
};

type AttendanceTableProps = {
  studentStatusList: StudentStatus[];
  setStudentStatusList: Dispatch<React.SetStateAction<StudentStatus[]>>;
};

export default function AttendanceTable({ studentStatusList, setStudentStatusList }: AttendanceTableProps) {
  return (
    <div className="border-2 mx-auto w-full">
      <div className="flex text-center font-bold *:border">
        <div className="w-[25%] py-2">Name</div>
        <div className="w-[25%] py-2">Registration No</div>
        <div className="w-[25%] py-2">Status</div>
        <div className="w-[25%] py-2">Change Status</div>
      </div>
      {studentStatusList.map((studentStatus: StudentStatus, i: number) => (
        <StudentAttendanceRow studentStatus={studentStatus} setStudentStatusList={setStudentStatusList} key={i} />
      ))}
    </div>
  );
}
