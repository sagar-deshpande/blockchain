const cryptoHash = require('./crypto-hash')

describe("cryptoHash()", () => {

    it ("gets a proper sha-256", () => {
        expect(cryptoHash('sagar')).toEqual('d51ae77904d69eb36a3a1c774def03c1a79c1dbc489641597120308fe9fb25e9')
    })

    it ("gets same output with same arguments in different order", () => {
        expect(cryptoHash("one","two","three")).toEqual(cryptoHash("three","one","two"))
    })
})