import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '@/types/ISchemas';

const AttendanceSchema: Schema<IAttendance> = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Absent',
    required: true,
  },
});

export default AttendanceSchema;
