const mysql = require('mysql')

const conexao = mysql.createConnection({
     host: 'localhost',
     port: 3306,
     user: 'kamila',
     password: 'password',
     database: 'petshop'
})

module.exports = conexao

