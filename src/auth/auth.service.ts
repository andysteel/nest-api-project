import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './model/jwt-payload.model';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService) {

    }

    async signUp(dto: AuthCredentialsDTO): Promise<void> {

        return await this.userRepository.signUp(dto)
    }

    async signIn(dto: AuthCredentialsDTO): Promise<{ accessToken: string}> {

        const username = await this.userRepository.validateUserPassword(dto)

        if(!username) {
            throw new UnauthorizedException('Invalid credentials.')
        }

        const payload: JwtPayload = { username }
        const accessToken = this.jwtService.sign(payload)
        return { accessToken }
    }
}
