import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks-inmemory.model';
import { v1 as uuid } from "uuid";
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    public getAllTasks(): Task[] {
        return this.tasks;
    }

    public getTasksWithFilter(dto: GetTasksFilterDTO): Task[] {
        const { status, search } = dto

        let tasks = this.getAllTasks()

        if(status) {
            tasks = tasks.filter(task => task.status === status)
        }

        if(search) {
            tasks = tasks.filter(task => {
                task.title.includes(search) ||
                task.description.includes(search)
            })
        }

        return tasks
    }

    public getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id)
        if(!found) {
            throw new NotFoundException(`Task With ID ${id} not found.`)
        }
        return found
    }

    public createTask(dto: CreateTaskDTO): Task {
        const { title, description } = dto

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task)
        return task
    }

    public deleteTaskById(id: string): void {
        const found = this.getTaskById(id)
        this.tasks.find( task => {
            if(task.id === found.id) {                
                this.tasks.splice(this.tasks.indexOf(task))
            }
        })
    }

    public updateTakStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id)
        task.status = status
        return  task
    }
}
