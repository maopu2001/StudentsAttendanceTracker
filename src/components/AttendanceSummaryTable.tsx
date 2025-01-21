'use client';
import React from 'react';
import { useQuery } from 'react-query';

type Student = {
  name: string;
  regNo: string;
  present: number;
  total: number;
};

export default function AttendanceSummaryTable({ courseId }: { courseId: string }) {
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetch(`/api/students/attendanceSummary?courseId=${courseId}`).then((res) => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="border-2 mx-auto w-full">
      <div className="flex text-center font-bold">
        <div className="w-[40%]">Name</div>
        <div className="w-[15%] border">Registration No</div>
        <div className="w-[15%] border">Present</div>
        <div className="w-[15%] border">Total</div>
        <div className="w-[15%] border">Attendance Percentage</div>
      </div>
      {studentsData.students.map((student: Student, i: number) => (
        <div key={i} className="flex text-center">
          <div className="text-left px-2 w-[40%] border">{student.name}</div>
          <div className="w-[15%] border">{student.regNo}</div>
          <div className="w-[15%] border">{student.present}</div>
          <div className="w-[15%] border">{student.total}</div>
          <div className="w-[15%] border">
            {student.total === 0 ? (100).toFixed(2) : ((student.present / student.total) * 100).toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}
