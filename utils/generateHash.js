const bcrypt = require('bcrypt')

module.exports = {
    generateHash: (password ,saltBounds)=>{
        const salt = bcrypt.genSaltSync(saltBounds)
        return bcrypt.hashSync(password, salt)
    }
}