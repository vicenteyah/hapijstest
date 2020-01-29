'use strict'
const Sequelize = require('sequelize')
const { User } = require('../ps-modles')
const uuid4 = require('uuid/v4')
const Boom = require('@hapi/boom')
const { generateHash } = require('../utils/generateHash')
const Op = Sequelize.Op
async function getUser({ query }, h){
    let totalUsers, listUsers, filters = {}
    try{
        totalUsers = await User.count()
    }catch (err){
        throw Boom.badImplementation('something went wrong')
    }
    if (query.page && query.offset) throw Boom.badRequest('Only one query param is allowed: offset or page')
    
    let{
        name,
        limit = 10,
        page = 1,
        offset =(page - 1) * limit
    } = query
    const totalPages = Math.ceil(totalUsers / limit)
    if (page === totalPages) limit -= totalPages * limit - totalUsers
    if(name) filters = {name: {[Op.substring]:name}}
    try{
        listUsers = await User.findAll({ where: filters })
    }catch(err){
        throw Boom.badImplementation('something went wrong')
    }
    listUsers = listUsers.slice(offset, offset + limit)
    return h.response({
        page,
        perPage: limit,
        totalUsers,
        listUsers
    }).code(200).header('Content-type','application/json')
}

async function createUser({ payload },h){
    let { active = true } = payload
    payload.active = active
    payload.password = generateHash(payload.password,10)
    const dataUser = Object.assign(payload, {uuid: uuid4()})
    let user 
    try{
        user = await User.create(dataUser)
    }catch (err){
        console.log(err)
        throw Boom.badImplementation('save error')
    }
    
    return h.response({id: user.uuid, message: 'sucssesfully created'}).code(201).header('Content-type','application/json')
}

async function getUserByUuid({ params }, h) {
    let { userUuid } = params, user
    try{
        user = await User.findOne({ where : {uuid: userUuid}})
    }catch (err){
        throw Boom.badImplementation('something went wrong')
    }
    return h
        .response(user)
        .code(200)
        .header('Content-type','application/json')
}

module.exports = {
    getUser,
    createUser,
    getUserByUuid
}