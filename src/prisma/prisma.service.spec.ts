import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

jest.mock('../generated/prisma.binding');
jest.mock('../configuration/configuration.service');

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: 'ConfigurationService',
          useValue: {
            prismaEndpoint: 'ep1',
            prismaSecret: 's1',
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
