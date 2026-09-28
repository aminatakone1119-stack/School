import { Controller, Post, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class UploadsService {
  async getUploadSignedUrl(bucket: string, path: string, schoolId: string) {
    // Generates pre-signed URL for Supabase Storage buckets
    // (student-photos, school-assets, receipts)
    return {
      bucket,
      path: `${schoolId}/${path}`,
      uploadUrl: `https://mock-supabase.co/storage/v1/upload/${bucket}/${schoolId}/${path}`,
    };
  }
}

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Obtenir une URL signée de téléversement Supabase Storage' })
  async presign(@CurrentUser() user: AuthenticatedUser) {
    return this.uploadsService.getUploadSignedUrl('student-photos', 'profile.jpg', user.school_id);
  }
}

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
