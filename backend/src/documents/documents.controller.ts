import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../models/User.model';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/document.dto';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('dbs')
  @Roles(UserRole.Tutor, UserRole.Admin)
  async uploadDBS(@GetUser() user: any, @Body() dto: UploadDocumentDto) {
    return this.documentsService.uploadDBS(user, dto);
  }

  @Post('upload')
  @Roles(UserRole.Tutor, UserRole.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @GetUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) return { message: 'No file provided' };
    return this.documentsService.uploadFile(user, file);
  }
}
