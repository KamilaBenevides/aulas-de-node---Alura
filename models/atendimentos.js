const conexao = require('../infraestrutura/conexão')
const moment = require('moment')

class Atendimentos {
    adiciona(atendimento, res) {
         const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
         const dataAtendimento = moment(atendimento.dataAtendimento, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
         
         const dataEhValida = moment(dataAtendimento).isSameOrAfter(dataCriacao)
         const clienteEhValido = atendimento.cliente.length >= 5

         const validacoes = [
             {
                 nome: 'data',
                 valido: dataEhValida,
                 mensagem: 'Data deve ser maior ou igual a data atual'
             },
             {
                 nome: 'cliente',
                 valido: clienteEhValido,
                 mensagem: 'Cliente deve ser maior ou igual a 5 caracteres'
             }
         ]
         const erros = validacoes.filter(campo => !campo.valido)
         const existeErros = erros.length
         if(existeErros){
             res.status(400).json(erros)
         }
         else{
            const atendimentoDatado = {...atendimento, dataAtendimento}

            const sql = 'INSERT INTO Atendimentos SET ?'
    
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                    res.status(400).json(erro)
                } else {
                  res.json(atendimento)
                }
            })
         }
         
    }
    lista(res){
         const sql = 'SELECT * FROM Atendimentos'
         conexao.query(sql, (erro, resultados) =>{
             if(erro){
                 res.status(400).json(erro)
             } else {
                 res.status(200).json(resultados)
             }
         })
         
    }
    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`
        conexao.query(sql, (erro, resultados) =>{
            const atendimento = resultados[0];
            if(erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json(atendimento)
            }
        })
    }
    autera(id, valores, res) {
        if(valores.dataAtendimento){
            valores.dataAtendimento = moment(valores.dataAtendimento, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json({...valores, id})
            }
        })
    }
    deleta(id, res){
        const sql = 'DELETE FROM Atendimentos WHERE id=?'
        conexao.query(sql, id, (erro, resultados) =>{
            if(erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json(id)
            }
        })
    }
 }
 
module.exports = new Atendimentos

