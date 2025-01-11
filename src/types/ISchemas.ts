import { Document, Schema } from 'mongoose';

export interface ICourses extends Document {
  title: string;
  courseCode: string;
  code: number;
  semester: Schema.Types.ObjectId;
}

export interface ISemester extends Document {
  name: string;
  program: string;
}

export interface IStudents extends Document {
  name: string;
  regNo: string;
  session: string;
  semester: Schema.Types.ObjectId;
}

export interface ITeachers extends Document {
  name: string;
  email: string;
  phone: string;
  designation: string;
  courses: Schema.Types.ObjectId[];
}

export interface IAttendance extends Document {
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  semester: Schema.Types.ObjectId;
  date: string;
  status: 'present' | 'absent';
}
