import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entity';

function randomNum() {
  return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {
  @Inject(DbService)
  private readonly dbService: DbService;
  async list(name?: string) {
    const books: Book[] = await this.dbService.read();
    if(name){
      return books.filter((book) => book.name.includes(name));
    }
    return books;
  }
  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    return books.find((book) => book.id === id);
  }
  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const book = new Book();
    book.id = randomNum();
    Object.keys(createBookDto).forEach((key) => {
      if (createBookDto[key] !== undefined) {
        book[key] = createBookDto[key];
      }
    });
    books.push(book);
    await this.dbService.write(books);
    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const foundBook = books.find((book) => book.id === updateBookDto.id);
    if (!foundBook) {
      throw new BadRequestException('该图书不存在');
    }
    Object.keys(updateBookDto).forEach((key) => {
      if (updateBookDto[key] !== undefined) {
        foundBook[key] = updateBookDto[key];
      }
    });
    await this.dbService.write(books);
    return foundBook;
  }

  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      await this.dbService.write(books);
    }
  }
}
