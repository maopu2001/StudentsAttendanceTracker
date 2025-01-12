import mongoose, { Schema } from 'mongoose';
import { IStudents } from '@/types/ISchemas';

const StudentsSchema: Schema<IStudents> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  semester: {
    type: Schema.Types.ObjectId,
    ref: 'Semesters',
    required: true,
  },
});

export default StudentsSchema;
