import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TutorSubject } from './TutorProfile.model';

@Schema({ _id: false })
export class ExamBoardEntry extends Document {
  @Prop({
    type: String,
    enum: TutorSubject,
    required: true,
  })
  subject: TutorSubject;

  @Prop({
    type: String,
    enum: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC (Eduqas)', 'CCEA'],
    required: true,
  })
  board: string;
}

export const ExamBoardEntrySchema =
  SchemaFactory.createForClass(ExamBoardEntry);
