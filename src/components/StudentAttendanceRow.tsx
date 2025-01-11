import React, { Dispatch, useEffect, useState } from 'react';
import { Switch } from './ui/switch';

type StudentStatus = {
  attendanceId: string | null;
  studentId: string;
  name: string;
  regNo: string;
  status: string;
};

type StudentAttendanceRowProps = {
  studentStatus: StudentStatus;
  setStudentStatusList: Dispatch<React.SetStateAction<StudentStatus[]>>;
};

export default function StudentAttendanceRow({ studentStatus, setStudentStatusList }: StudentAttendanceRowProps) {
  const [status, setStatus] = useState(studentStatus.status);

  useEffect(() => {
    setStudentStatusList((prev: StudentStatus[]) => {
      return prev.map((student: StudentStatus) => {
        if (student.studentId === studentStatus.studentId) {
          return {
            ...student,
            status,
          };
        }
        return student;
      });
    });
  }, [status, setStudentStatusList, studentStatus.studentId]);

  const changeStatus = () => (status === 'absent' ? setStatus('present') : setStatus('absent'));

  return (
    <div className="flex text-center *:border">
      <div className="text-left px-2 w-[25%] py-1">{studentStatus.name}</div>
      <div className="w-[25%] py-1">{studentStatus.regNo}</div>
      <div className="w-[25%] py-1">{status ? 'Present' : 'Absent'}</div>
      <div className="w-[25%] py-1">
        <Switch onClick={changeStatus} />
      </div>
    </div>
  );
}
