import mongoose, { Schema } from 'mongoose';
import { ISemesters } from '@/types/ISchemas';

const SemestersSchema: Schema<ISemesters> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
});

export default SemestersSchema;
