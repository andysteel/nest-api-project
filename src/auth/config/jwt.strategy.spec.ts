import { UserRepository } from "../repository/user.repository";
import { Test } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "../model/user.entity";
import { UnauthorizedException } from "@nestjs/common";

const mockUserRepository = () => ({
    findOne: jest.fn()
})

describe('JwtStrategy', () => {

    let jwtStrategy: JwtStrategy
    let userRepository

    beforeEach( async () => {
        const module = Test.createTestingModule({
            providers: [
                JwtStrategy,
                {provide: UserRepository, useFactory: mockUserRepository}
            ]
        }).compile()

        jwtStrategy = (await module).get<JwtStrategy>(JwtStrategy)
        userRepository = (await module).get<UserRepository>(UserRepository)
    })

    describe('validate', () => {
        it('validate and return user', async () => {
            const user = new User()
            user.username = 'testuser'

            userRepository.findOne.mockResolvedValue(user)
            const result = await jwtStrategy.validate({username: 'testuser'})
            expect(result).toEqual(user)
        })
        it('throws unauthorized exception', () => {
            userRepository.findOne.mockResolvedValue(null)
            expect(jwtStrategy.validate({username: 'testuser'})).rejects.toThrow(UnauthorizedException)
        })
    })

})