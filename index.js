const customExpress = require('./config/customExpress')
const conexao = require('./infraestrutura/conexão')
const tabelas = require('./infraestrutura/tabelas')

conexao.connect((erro) => {
     if(erro) console.log('deu erro em:', erro)
     else{ 
          console.log('conectou')
          tabelas.init(conexao)
          const app = customExpress()
          app.listen(3000,() => console.log('Servidor rodando na porta 3000'))
     }
})

