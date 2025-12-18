import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
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
}
