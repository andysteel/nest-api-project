import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service'
import { TaskRepository } from './repository/task.repository'
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto'
import { TaskStatus } from './tasks-status.enum'
import { User } from '../auth/model/user.entity'
import { NotFoundException } from '@nestjs/common'

const mockUser: User = new User()
mockUser.id = 1
mockUser.username = 'Test User'
mockUser.password = 'password'
mockUser.salt = '123456'
mockUser.tasks = []

const mockTaskRrepository = () => ({
    getAllTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
})

describe('TaskService', () => {
    
    let taskService
    let taskRepository
    const mockTask = {title: 'Test task', description: 'Test desc'}

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRrepository }
            ]
        }).compile()

        taskService = await module.get<TasksService>(TasksService)
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    })

    describe('getTasks', () => {
        it('get tasks from repository', async () => {
            taskRepository.getAllTasks.mockResolvedValue('someValue')
            expect(taskRepository.getAllTasks).not.toHaveBeenCalled()

            const filters: GetTasksFilterDTO = { status: TaskStatus.IN_PROGRESS, search: 'some query' }
            const result = await taskService.getAllTasks(filters, mockUser)
            expect(taskRepository.getAllTasks).toHaveBeenCalled()
            expect(result).toEqual('someValue')
        })
    })

    describe('getTasksById', () => {
        it('retirve task by id', async () => {
            
            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await taskService.getTaskById(1, mockUser)
            expect(result).toEqual(mockTask)
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: mockUser.id
                }
            })
        })
        it('throw error', () => {
            taskRepository.findOne.mockResolvedValue(null)
            expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask', () => {
        it('create a new task', async () => {
            taskRepository.createTask.mockResolvedValue(mockTask)
            const result = await taskService.createTask(mockTask, mockUser)
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser)
            expect(result).toEqual(mockTask)
        })

    })

    describe('deleteTask', () => {
        it('delete a given id task', async () => {
            taskRepository.delete.mockResolvedValue({affected: 1})
            await taskService.deleteTaskById(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalled()
        })

        it('throw error',() => {
            taskRepository.delete.mockResolvedValue({affected: 0})

            expect(taskService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('updateTaskStatus', () => {
        it('update the status from a task', async () => {
            const save = jest.fn().mockResolvedValue(true)

            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            })

            const result = await taskService.updateTakStatus(1, TaskStatus.DONE, mockUser)
            expect(taskService.getTaskById).toHaveBeenCalled()
            expect(save).toHaveBeenCalled()
        })

        it('throw error', () => {

        })
    })
})