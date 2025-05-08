import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MapTestInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // 启用CORS
  app.enableCors();
  // 注册全局管道，并将全局管道设置为transform: true，表示在处理请求参数时自动进行类型转换和验证
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 把 uploads 目录设置为静态文件目录
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' });
  // 设置全局拦截器，统一返回格式
  app.useGlobalInterceptors(new MapTestInterceptor());
  // 设置错误拦截器，统一返回格式
  app.useGlobalFilters(new HttpExceptionFilter());
  // 启动端口
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
