import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  create(createBookDto: CreateBookDto) {
    return {
      ok: true,
      message: 'This action adds a new book',
      data: createBookDto,
    };
  }

  findAll() {
    return { ok: true, message: `This action returns all book` };
  }

  findOne(id: number) {
    return { ok: true, message: `This action returns a #${id} book` };
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return {
      ok: true,
      message: `This action updates a #${id} book`,
      data: updateBookDto,
    };
  }

  remove(id: number) {
    return { ok: true, message: `This action removes a #${id} book` };
  }
}
