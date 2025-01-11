import mongoose, { Schema } from 'mongoose';
import { ICourses } from '@/types/ISchemas';

const CoursesSchema: Schema<ICourses> = new Schema({
  title: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semesters',
    required: true,
  },
});

export default mongoose.models.Courses || mongoose.model<ICourses>('Courses', CoursesSchema);
