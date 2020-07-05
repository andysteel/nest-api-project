import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health/health/health.controller';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    TasksModule,
    TerminusModule, 
    AuthModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
