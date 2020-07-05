import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks-inmemory.service';
import { Task, TaskStatus } from './tasks-inmemory.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {

    constructor(private tasksSvervice: TasksService){}

    @Get('/filter')
    getTasks(@Query(ValidationPipe) dto: GetTasksFilterDTO): Task[] {
        if(Object.keys(dto).length) {
            return this.tasksSvervice.getTasksWithFilter(dto)
        } else {
            return this.tasksSvervice.getAllTasks()
        }
    }

    @Get()
    getAllTasks(): Task[] {
        return this.tasksSvervice.getAllTasks()
    }

    @Get('/:id')
    getTAskById(@Param('id') id: string): Task {
        return this.tasksSvervice.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() dto: CreateTaskDTO): Task {
        return this.tasksSvervice.createTask(dto)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void {
        this.tasksSvervice.deleteTaskById(id)
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task {

        return  this.tasksSvervice.updateTakStatus(id, status)
    }
}
