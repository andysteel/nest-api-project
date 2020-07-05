import { Test } from "@nestjs/testing"
import { UserRepository } from "./user.repository"
import { ConflictException, InternalServerErrorException } from "@nestjs/common"
import { User } from "../model/user.entity"
import * as bcrypt from "bcrypt";

const mockCredentialsDTO = { username: 'andersondias', password: 'testeTest123'}

describe('UserRepository', () => {

    let userRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile()
        userRepository = module.get<UserRepository>(UserRepository)
    })

    describe('SignUP', () => {
        let save

        beforeEach(() => {
            save = jest.fn().mockImplementation(undefined)
            userRepository.create = jest.fn().mockReturnValue({ save })
        })

        it('success signup', () => {
            save.mockResolvedValue(Promise.resolve())
            expect(userRepository.signUp(mockCredentialsDTO)).resolves.not.toThrow()
        })

        it('throws conflict excpetion', () => {
            save.mockRejectedValue({code: '23505'})
            expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow()
        })

        it('throws internal excpetion', () => {
            save.mockRejectedValue({code: '1232465'})
            expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('Validate user password', () => {
        let user

        beforeEach(() => {
            userRepository.findOne = jest.fn()
            user = new User()
            user.username = 'andersondias'
            user.password = 'testeTeste123'
            user.validatePassword = jest.fn()
        })

        it('return username for validation success', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(true)

            const result = await userRepository.validateUserPassword(mockCredentialsDTO)
            expect(result).toEqual('andersondias')
        })
        it('return null for user not found', async () => {
            userRepository.findOne.mockResolvedValue(null)
            const result = await userRepository.validateUserPassword(mockCredentialsDTO)
            expect(user.validatePassword).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })
        it('return null for password invalid', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(false)
            const result = await userRepository.validateUserPassword(mockCredentialsDTO)
            expect(result).toBeNull()
        })
    })

    describe('hashPassword', () => {
        const mockPassword = '01234'
        const mockSalt = '56789'
        const mockHash = 'testeHash'
        bcrypt.hash = jest.fn()

        it('will hash the password', async () => {
            bcrypt.hash.mockResolvedValue(mockHash)
            const result = await userRepository.hashPassword(mockPassword, mockSalt)
            expect(result).not.toBeNull()
            expect(result).not.toBeUndefined()
            expect(result).toEqual(mockHash)
        })
    })
})