import { DynamicModule } from '@nestjs/common';
import { DbService } from './db.service';

export interface DbModuleOptions {
  path: string;
}

export class DbModule {
  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [
        DbService,
        {
          provide: 'OPTIONS',
          useValue: options,
        },
      ],
      exports: [DbService],
    };
  }
}
