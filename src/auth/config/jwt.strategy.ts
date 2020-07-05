import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "../repository/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "../model/jwt-payload.model";
import * as config from "config";

const jwtConfig = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || jwtConfig.secret
        })
    }

    async validate(payload: JwtPayload) {
        const { username } = payload
        const user = await this.userRepository.findOne({ username })

        if(!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}