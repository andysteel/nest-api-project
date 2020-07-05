import { Repository, EntityRepository } from "typeorm";
import { Task } from "../model/task.entity";
import { CreateTaskDTO } from "../dto/create-task.dto";
import { TaskStatus } from "../tasks-status.enum";
import { GetTasksFilterDTO } from "../dto/get-tasks-filter.dto";
import { User } from "src/auth/model/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async createTask(dto: CreateTaskDTO, user: User): Promise<Task> {
        const { title, description } = dto

        const task =  new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()
        delete task.user

        return task
    }

    async getAllTasks(dto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        const { status, search } = dto
        const query = this.createQueryBuilder('task')
        query.where('task.user = :userId', {userId: user.id})

        if(status) {
            query.andWhere('task.status = :status', { status } )
        }

        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` } )
        }
        return await query.getMany()
    }
}