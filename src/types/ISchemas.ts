import { Document, Types } from 'mongoose';

export interface ICourses extends Document {
  title: string;
  courseCode: string;
  code: number;
  semester: Types.ObjectId;
}

export interface ISemesters extends Document {
  name: string;
  program: string;
}

export interface IStudents extends Document {
  name: string;
  regNo: string;
  session: string;
  semester: Types.ObjectId;
}

export interface ITeachers extends Document {
  name: string;
  email: string;
  phone: string;
  designation: string;
  courses: Types.ObjectId[];
}

export interface IAttendance extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  semester: Types.ObjectId;
  date: string;
  status: 'Present' | 'Absent';
}
