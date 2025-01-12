import { IAttendance, ICourses, ISemesters, IStudents, ITeachers } from '@/types/ISchemas';
import mongoose from 'mongoose';
import AttendanceSchema from './attendance';
import CoursesSchema from './courses';
import SemestersSchema from './semester';
import StudentsSchema from './students';
import TeachersSchema from './teachers';

let Attendances: mongoose.Model<IAttendance>;
let Courses: mongoose.Model<ICourses>;
let Semesters: mongoose.Model<ISemesters>;
let Students: mongoose.Model<IStudents>;
let Teachers: mongoose.Model<ITeachers>;

const intializeSchemas = () => {
  Attendances = mongoose.models.Attendances || mongoose.model<IAttendance>('Attendances', AttendanceSchema);
  Courses = mongoose.models.Courses || mongoose.model<ICourses>('Courses', CoursesSchema);
  Semesters = mongoose.models.Semesters || mongoose.model<ISemesters>('Semesters', SemestersSchema);
  Students = mongoose.models.Students || mongoose.model<IStudents>('Students', StudentsSchema);
  Teachers = mongoose.models.Teachers || mongoose.model<ITeachers>('Teachers', TeachersSchema);
};

export { intializeSchemas, Attendances, Courses, Semesters, Students, Teachers };
