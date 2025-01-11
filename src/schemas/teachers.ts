import mongoose, { Schema } from 'mongoose';
import { ITeachers } from '@/types/ISchemas';

const TeachersSchema: Schema<ITeachers> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    default: 'Lecturer',
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
      required: true,
    },
  ],
});

export default mongoose.models.Teachers || mongoose.model<ITeachers>('Teachers', TeachersSchema);
