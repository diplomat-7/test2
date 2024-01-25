import { unlink } from 'fs';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Storage, UploadResponse } from '@google-cloud/storage';

import { Document } from './document.model';

import { IAppConfig } from 'src/commons/interface/interface';
import { IDocument, ITieDocumentModel } from './document.interface';

import { CommonsService } from 'src/commons/commons.service';

@Injectable()
export class DocumentService {
  private storage: Storage;
  private publicBucket: string;

  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
    private readonly commonsService: CommonsService,
    private readonly configService: ConfigService,
  ) {
    const { storage } = this.configService.get<IAppConfig>('config');
    this.storage = new Storage({
      projectId: storage.projectId,
      credentials: {
        private_key: storage.privateKey,
        client_email: storage.clientEmail,
      },
    });
    this.publicBucket = storage.publicBucket;
  }

  async create(data: IDocument): Promise<Document> {
    data.framer_id = this.commonsService.generateFramerId('DC');
    return this.documentRepository.create<Document>({ ...data });
  }

  async delete(documentId: number): Promise<void> {
    await this.documentRepository.destroy({
      where: { id: documentId },
    });
  }

  async load(documentId: number): Promise<Document> {
    return this.documentRepository.findByPk(documentId);
  }

  async findOne(data: IDocument): Promise<Document> {
    return this.documentRepository.findOne<Document>({
      where: { ...data },
      order: [['id', 'desc']],
    });
  }

  async update(data: IDocument, documentId: number): Promise<any> {
    return this.documentRepository.update(data, { where: { id: documentId } });
  }

  async getSignedUrl(filename: string): Promise<string> {
    const [signedUrl] = await this.storage
      .bucket(this.publicBucket)
      .file(filename)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 2 * 60 * 1000,
      });

    return signedUrl;
  }

  deleteFileFromPath(filename: string): void {
    const filePath = `./tmp/${filename}`;

    unlink(filePath, (err) => {
      if (err) console.error(err);
      else {
        console.log(`Removed ${filename} file from tmp folder`);
      }
    });
  }

  async upload(filename: string, path: string): Promise<UploadResponse> {
    const bucket = this.storage.bucket(this.publicBucket);
    const filePath = `./tmp/${filename}`;

    return bucket.upload(filePath, {
      destination: `${path}/${filename}`,
    });
  }

  async tieModelToDocument(tieDocumentModel: ITieDocumentModel) {
    const { documentId, data, transaction, type } = tieDocumentModel;
    const document = await this.documentRepository.findByPk(documentId);

    if (!document) {
      throw new BadRequestException('Invalid document id');
    }

    if (document.user_id != data.user_id) {
      throw new UnauthorizedException('Permission denied! Invalid user');
    }

    if (type && type != document.type) {
      throw new BadRequestException(`Invalid document type ${document.type}`);
    }

    await this.documentRepository.update(
      { ...data },
      { where: { id: documentId }, transaction },
    );
  }
}
