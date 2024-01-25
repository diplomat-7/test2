import {
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Request,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileUploadDTO } from './document.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { FILE_EXTENSIONS } from './document.constants';

import { DocumentService } from './document.service';
import { IRequest } from 'src/commons/interface/interface';
import { DocumentGuard } from './document.guard';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp',
        filename(req, file, callback) {
          const ext = extname(file.originalname).toLowerCase();
          const id = `FU-${(Math.random() * Date.now()).toString()}`;
          file.originalname = `${req.body.path}-${Date.now()}-${id.slice(
            0,
            10,
          )}${ext}`;
          callback(null, file.originalname);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() data: FileUploadDTO,
    @Request() req: IRequest,
  ) {
    if (!file) throw new BadRequestException('file param is mandatory');

    const ext = extname(file.originalname).toLowerCase();
    if (FILE_EXTENSIONS.indexOf(ext) == -1) {
      throw new BadRequestException(`Unsupported extention (${ext})`);
    }

    const filename = file.originalname;
    const path = data.path;

    return this.documentService
      .upload(filename, path)
      .then(async () => {
        this.documentService.deleteFileFromPath(filename);

        const docCreateData = {
          type: path,
          name: filename,
          user_id: req.user.id,
          issued_date: new Date(),
          lang_type: data.lang_type,
          link: `${path}/${filename}`,
        };

        const document = await this.documentService.create(docCreateData);

        return {
          message: 'file uploaded successfully',
          data: document,
        };
      })
      .catch((err) => {
        console.error(`Error uploading file, ${err}, filename: ${filename}`);
        this.documentService.deleteFileFromPath(filename);
      });
  }

  @Get('/file')
  @UseGuards(AuthGuard)
  async getFileUrl(@Query('filename') filename: string) {
    if (!filename) throw new BadRequestException('filename is required');
    const url = await this.documentService.getSignedUrl(filename);
    return { data: { url } };
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, DocumentGuard)
  async remove(@Param('id') documentId: number) {
    await this.documentService.delete(documentId);
  }
}
