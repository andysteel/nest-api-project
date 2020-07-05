import * as bcrypt from "bcrypt";
import { User } from "./user.entity"

describe('User Entity', () => {

    let user: User

    beforeEach(() => {
        user = new User()
        user.password = 'testPassword'
        user.salt = 'testSalt'
        bcrypt.hash = jest.fn()
    })

    describe('Validate password', () => {
        it('returns true to valid password', async () => {
            bcrypt.hash.mockReturnValue('testPassword')
            const result = await user.validatePassword('123456')
            expect(bcrypt.hash).toHaveBeenCalledWith('123456','testSalt')
            expect(result).toEqual(true)
        })
        it('returns false to invalid password', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword')
            const result = await user.validatePassword('wrongPassword')
            expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword','testSalt')
            expect(result).toEqual(false)
        })
    })
})