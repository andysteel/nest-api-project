import { Controller, Get, Req, Res } from '@nestjs/common';
import { HealthCheckService, DNSHealthIndicator, HealthCheck, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { Request, Response } from 'express';
import { Timestamp } from 'typeorm';

@Controller('health')
export class HealthController {

    constructor(private healthService: HealthCheckService, 
                private dns: DNSHealthIndicator,
                private memory: MemoryHealthIndicator,
                private disk: DiskHealthIndicator) {}
     
    @Get()
    @HealthCheck()            
    healthChek() {
        return this.healthService.check([
            () => this.dns.pingCheck('google', 'https://google.com', {timeout: 0})
        ])
    }

    @Get('/memory')
    @HealthCheck()
    memoryCheck() {
        return this.healthService.check([
            () => this.memory.checkHeap('memory',8192)
        ])
    }

    @Get('/disk')
    @HealthCheck()
    diskCheck() {
        return this.healthService.check([
            () => this.disk.checkStorage('disk', {threshold: 350 * 1024 * 1024 * 1024, path: '/'})
        ])
    }

    @Get('performance')
    performanceCheck(@Req() req: Request, @Res() res: Response) {
        const inicio = new Date().getMilliseconds()
        console.log(inicio)
        console.log(Math.random().toPrecision(2))
        const fim  = new Date().getMilliseconds()
        const final = fim - inicio
        console.log(final)
        res.setHeader('Custom-Header', final)
        return res.sendStatus(200)
    }

    // @Get('/grpc')
    // @HealthCheck()
    // grpcCheck() {
    //     return this.healthService.check([
    //         () => this.grpc.checkService()
    //     ])
    // }
}
