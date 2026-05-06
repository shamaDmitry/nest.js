import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { DeleteBooksDto } from './dto/delete-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.booksService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.booksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.booksService.update(id, updateBookDto);
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBatch(@Body() deleteBooksDto: DeleteBooksDto) {
    return await this.booksService.removeBatch(deleteBooksDto.ids);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.booksService.remove(id);
  }
}
