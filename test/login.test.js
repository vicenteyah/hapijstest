/* eslint env jest */
const expect = require('expect')
const server = require('../index')

beforeAll((done) =>{
    server.events.on('start', ()=>{
        done()
    })
})

afterAll((done)=>{
    server.events.on('stop',()=>{
        done()
    })
    server.stop()
})

const header = {
    url: '/v1/login',
}

const correctPayload = {
    name:'admin',
    password: 'admin'
}

const incorrectPayload = {
    naem: 'asdas',
    password: 'sadas'
}

test('returns correct authentication token and message', async function (done){
    expect.assertions(2)
    const req = Object.assign({}, header, {method: 'POST'},{ payload: correctPayload })
    const res = await server.inject(req)
    expect(res.statusCode).toBe(200)
    expect(res.result).toHaveProperty('token')
    done()
})

test('returns incorrect authentication token and message ', async function (done) {
    expect.assertions(1)
    const req = Object.assign({}, header, { method: 'POST' }, { payload: incorrectPayload })
    const res = await server.inject(req)
    expect(res.statusCode).toBe(400)
    done()
})