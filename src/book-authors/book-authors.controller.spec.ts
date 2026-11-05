import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorController } from './book-authors.controller.js';

describe('BookAuthorController', () => {
  let controller: BookAuthorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookAuthorController],
    }).compile();

    controller = module.get<BookAuthorController>(BookAuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
