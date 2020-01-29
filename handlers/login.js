 const { User } =  require('../ps-modles')
 const Boom = require('@hapi/boom')
 const { matchPassword } = require('../utils/matchPassword')
 const { generateToken } = require('../utils/token')

 async function login({ payload }, h ){
    const {
        name,
        password,
    }= payload
    let matchUser
    try{
        matchUser = await User.findOne({
            where:{ name }
        })
    }catch (err){
        throw Boom.badImplementation('Error accessing to database')
    }
    if (!matchUser) throw Boom.unauthorized('User not found ')
    const matchPass = await matchPassword(password, matchUser.dataValues.password)
    if(!matchPass)throw Boom.unauthorized('invalid password')
    payload.password = matchUser.dataValues.password
    const token = generateToken(payload)

    return h
        .response({
            message: 'Access Success',
            token
        }).code(200).header('Content-type','application/json')

 }
 module.exports = {
    login
 }