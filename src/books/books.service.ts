import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { SearchQueryDto } from '../common/dto/search-query.dto';
import { QueryHelper } from '../common/utils/query-helper.util';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(createBookDto);

    return await this.bookRepository.save(newBook);
  }

  async findAll(queryDto: SearchQueryDto) {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');
    const searchableFields = [
      'title',
      'author',
      'description',
      'publishedYear',
    ];

    QueryHelper.applySearchAndFilters(
      queryBuilder,
      queryDto,
      searchableFields,
      'book',
      'id',
    );

    const [data, totalEntities] = await queryBuilder.getManyAndCount();

    const limit = queryDto.limit || 10;
    const totalPages = Math.ceil(totalEntities / limit);
    const currentPage =
      queryDto.page || Math.floor((queryDto.offset || 0) / limit) + 1;

    return {
      data,
      meta: {
        totalEntities,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.preload({
      id: id,
      ...updateBookDto,
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);

    await this.bookRepository.remove(book);
  }

  async removeBatch(ids: number[]): Promise<void> {
    const foundBooks = await this.bookRepository.findBy({
      id: In(ids),
    });

    if (foundBooks.length !== ids.length) {
      const foundIds = foundBooks.map((book) => book.id);

      const missingIds = ids.filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `Books with IDs ${missingIds.join(', ')} not found`,
      );
    }

    await this.bookRepository.delete(ids);
  }
}
