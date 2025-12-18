import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ExamBoardEntry extends Document {
  @Prop({
    type: String,
    enum: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC (Eduqas)', 'CCEA'],
    required: true,
  })
  subject: string;

  @Prop({ type: String, enum: ['MATH', 'SCIENCE', 'ENGLISH'], required: true })
  board: string;
}

export const ExamBoardEntrySchema =
  SchemaFactory.createForClass(ExamBoardEntry);
