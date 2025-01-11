'use client';
import AttendanceTable from '@/components/AttendanceTable';
import React, { use, useState } from 'react';
import { useQuery } from 'react-query';

type StudentStatus = {
  attendanceId: string | null;
  studentId: string;
  name: string;
  regNo: string;
  status: string;
};

type CourseData = {
  code: number;
  title: string;
  courseCode: string;
  _id: string;
  semester: {
    _id: string;
    name: string;
    program: string;
  };
};

function NewAttendance({ params }: { params: Promise<{ courseId: string; date: string }> }) {
  const { courseId, date } = use(params);
  const [studentStatusList, setStudentStatusList] = useState<StudentStatus[]>([]);
  const [courseData, setCourseData] = useState<CourseData>({} as CourseData);

  const { isLoading } = useQuery({
    queryKey: ['studentStatusList'],
    queryFn: () =>
      fetch(`/api/students/attendanceStatus?courseId=${courseId}&attendanceDate=${date}`)
        .then((res) => res.json())
        .then((res) => {
          setStudentStatusList(res.studentStatusList);
          setCourseData(res.course);
        }),
  });

  const submitAttendance = async () => {
    console.log(studentStatusList);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-6 items-center">
      <h1 className="text-xl font-bold">{courseData.semester.program}</h1>
      <h1 className="text-xl font-bold">{courseData.semester.name}</h1>
      <h1 className="text-xl font-bold">
        {courseData.title} ({courseData.courseCode})
      </h1>
      <p className="text-gray-600">Date: {date}</p>
      <button
        onClick={submitAttendance}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Submit
      </button>
      <div className="mt-8 w-full">
        <AttendanceTable studentStatusList={studentStatusList} setStudentStatusList={setStudentStatusList} />
      </div>
    </div>
  );
}

export default NewAttendance;
