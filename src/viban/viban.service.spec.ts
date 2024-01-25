import { Test, TestingModule } from '@nestjs/testing';
import { VibanService } from './viban.service';

describe('VibanService', () => {
  let service: VibanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VibanService],
    }).compile();

    service = module.get<VibanService>(VibanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
