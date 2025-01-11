import mongoose, { Schema } from 'mongoose';
import { ISemester } from '@/types/ISchemas';

const SemestersSchema: Schema<ISemester> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Semesters || mongoose.model<ISemester>('Semesters', SemestersSchema);
