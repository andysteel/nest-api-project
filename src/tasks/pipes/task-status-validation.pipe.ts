import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../tasks-inmemory.model";

export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value: any) {
        value = value.toUpperCase()

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`Task status ${value} not allowed.`)
        }

        return value
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status)
        return idx !== -1
    }
    
}