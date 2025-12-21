import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TutorSubject } from './TutorProfile.model';

export enum ExamBoard {
  AQA = 'AQA',
  PearsonEdexcel = 'Pearson Edexcel',
  OCR = 'OCR',
  WJEC = 'WJEC (Eduqas)',
  CCEA = 'CCEA',
}

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
    enum: ExamBoard,
    required: true,
  })
  board: ExamBoard;
}

export const ExamBoardEntrySchema =
  SchemaFactory.createForClass(ExamBoardEntry);
