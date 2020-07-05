import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './model/task.entity';
import { TaskStatus } from './tasks-status.enum';
import { TaskRepository } from './repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/model/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)    
        private taskRepository: TaskRepository) {

    }

    public async getAllTasks(dto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        
        return await this.taskRepository.getAllTasks(dto, user)
    }

    public async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id, user: user.id}})
        if(!found) {
            throw new NotFoundException(`Task With ID ${id} not found.`)
        }
        return found
    }
    
    public async createTask(dto: CreateTaskDTO, user: User): Promise<Task> {

        return await this.taskRepository.createTask(dto, user)
    }

    public async deleteTaskById(id: number, user: User): Promise<void> {
       const result = await this.taskRepository.delete({id, user: user})
       
       if(result.affected === 0) {
           
         throw new NotFoundException(`Task With ID ${id} not found.`)
       }
    }

    public async updateTakStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user)
        task.status = status
        return await task.save()
    }
}
