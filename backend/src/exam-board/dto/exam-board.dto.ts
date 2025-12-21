import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TutorSubject } from 'src/models/TutorProfile.model';

export class CreateExamBoardDto {
  @IsString({ message: 'Subject must be a string' })
  @IsEnum(TutorSubject, {
    message: 'Board must be one of MATH, SCIENCE, ENGLISH',
  })
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @IsString({ message: 'Board must be a string' })
  @IsEnum(['AQA', 'Pearson Edexcel', 'OCR', 'WJEC (Eduqas)', 'CCEA'], {
    message:
      'Subject must be one of AQA, Pearson Edexcel, OCR, WJEC (Eduqas), CCEA',
  })
  @IsNotEmpty({ message: 'Board is required' })
  board: string;
}
