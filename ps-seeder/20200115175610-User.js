'use strict';
const { generateHash } = require('../utils/generateHash')
let password = 'admin'
const saltBounds = 10
password = generateHash(password, saltBounds)

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users',[
        {
          name: 'admin',
          password,
          active: true,
          email: 'aeap@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],{})
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Users', null,{})
  }
};
