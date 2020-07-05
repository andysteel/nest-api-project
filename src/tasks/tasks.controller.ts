import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './model/task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './tasks-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/model/user.entity';
import { GetUser } from '../auth/model/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(
        @Query(ValidationPipe) dto: GetTasksFilterDTO, 
        @GetUser() user: User): Promise<Task[]> {
        
        return this.tasksService.getAllTasks(dto, user)
    }

    @Get('/:id')
    getTAskById(
            @Param('id', ParseIntPipe) id: number,
            @GetUser() user: User): Promise<Task> {

        return this.tasksService.getTaskById(id, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() dto: CreateTaskDTO, 
        @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(dto, user)
    }

    @Delete('/:id')
    deleteTaskById(
            @Param('id', ParseIntPipe) id: number, 
            @GetUser() user: User): Promise<void> {
        
        return this.tasksService.deleteTaskById(id, user)
    }

    @Patch('/:id/status')
    updateTaskStatus(
            @Param('id', ParseIntPipe) id: number, 
            @Body('status', TaskStatusValidationPipe) status: TaskStatus, 
            @GetUser() user: User): Promise<Task> {

        return  this.tasksService.updateTakStatus(id, status, user)
    }
}
