import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExamBoardEntry, ExamBoardEntrySchema } from './ExamBoardModel';

@Schema({ timestamps: true })
export class StudentProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [ExamBoardEntrySchema],
    default: [],
  })
  examBoards: ExamBoardEntry[];
}

export const StudentProfileSchema =
  SchemaFactory.createForClass(StudentProfile);

StudentProfileSchema.index(
  { user: 1, 'examBoards.subject': 1 },
  { unique: true, sparse: true },
);
