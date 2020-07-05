import { TaskStatus } from "../tasks-status.enum";
import { IsOptional, IsIn, IsNotEmpty, IsEnum } from "class-validator";

export class GetTasksFilterDTO {

    @IsEnum(TaskStatus)
    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    status: TaskStatus

    @IsOptional()
    @IsNotEmpty()
    search: string
}