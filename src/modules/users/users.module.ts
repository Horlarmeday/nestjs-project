import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
