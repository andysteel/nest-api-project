describe('my test', () => {
    it('resturns true', () => {
        expect(true).toEqual(true)
    })
})

//feature
class FriendList {
    friends = []

    addFriend(name: string) {
        this.friends.push(name)
        this.announceFriend(name)
    }

    announceFriend(name: string) {
        global.console.log(`${name} is now a friend`)
    }

    removeFriend(name: string) {
        const idx = this.friends.indexOf(name)

        if(idx === -1) {
            throw new Error("index not found")
        }

        this.friends.splice(idx,1)
    }
}

//tests
describe('FriendList', () => {

    let friendList

    beforeEach(() => {
        friendList = new FriendList()
    })

    it('initialize friends', () => {
        expect(friendList.friends.length).toEqual(0)
    })
    
    it('add a friend to list', () => {
        friendList.addFriend('Anderson')
        expect(friendList.friends.length).toEqual(1)
    })

    it('announce a friend', () => {
        friendList.announceFriend = jest.fn()
        expect(friendList.announceFriend).not.toHaveBeenCalled()
        friendList.addFriend('Anderson')
        expect(friendList.announceFriend).toBeCalledWith('Anderson')
    })

    describe('Remove from list', () => {
        it('removing', () => {
            friendList.addFriend('Anderson')
            expect(friendList.friends[0]).toEqual('Anderson')
            friendList.removeFriend('Anderson')
            expect(friendList.friends[0]).toBeUndefined()
        })

        it('removing error', () => {
            expect(() => friendList.removeFriend('Anderson')).toThrow()
        })
    })
})

