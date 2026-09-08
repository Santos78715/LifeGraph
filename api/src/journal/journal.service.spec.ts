import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JournalProducer } from './journel.producer';
import { JournalService } from './journal.service';

describe('JournalService', () => {
  let service: JournalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        { provide: PrismaService, useValue: {} },
        { provide: JournalProducer, useValue: { addJob: jest.fn() } },
      ],
    }).compile();

    service = module.get<JournalService>(JournalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
