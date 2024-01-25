import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { DocumentService } from './document.service';
import { IRequest } from 'src/commons/interface/interface';

@Injectable()
export class DocumentGuard implements CanActivate {
  constructor(private documentService: DocumentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const documentId = Number(request.params.id);

    if (!documentId) throw new NotFoundException('documentId is required');

    const document = await this.documentService.load(documentId);
    if (!document)
      throw new NotFoundException(`Failed to load document id ${documentId}`);

    if (request.user.id !== document.user_id) {
      throw new UnauthorizedException('Invalid document user');
    }

    request['document'] = document;

    return true;
  }
}
