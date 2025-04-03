import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('list')
  list() {
    return this.bookService.list();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bookService.findById(Number(id));
  }

  @Post('create')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Put('update')
  update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.bookService.delete(Number(id));
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: storage,
      limits: { fileSize: 1024 * 1024 * 3 },
      fileFilter: (req, file, cb) => {
        const extname = file.originalname.split('.').pop() || '';
        if (['png', 'jpg', 'gif'].includes(extname)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('只能上传图片'), false);
        }
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'file');
    return file.path;
  }
}
