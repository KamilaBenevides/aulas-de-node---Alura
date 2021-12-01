const conexao = require('../infraestrutura/database/conexão')
const moment = require('moment')
const { default: axios } = require('axios')
const repositorio = require('../repositorios/atendimentos')

class Atendimentos {
    constructor(){
        this.dataEhValida = (dataAtendimento, dataCriacao) => moment(dataAtendimento)
        .isSameOrAfter(dataCriacao)
        this.clienteEhValido = (tamanho) => tamanho >= 5
        this.valida = () => parametros => this.validacoes.filter(campo => {
            const { nome } = campo
            const parametro = parametros[nome]

            return !campo.valido(parametro)
        })
        this.validacoes = [
            {
                nome: 'dataAtendimento',
                valido: this.dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteEhValido,
                mensagem: 'Cliente deve ser maior ou igual a 5 caracteres'
            }
        ]
    }
    adiciona(atendimento) {
         const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
         const dataAtendimento = moment(atendimento.dataAtendimento, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
         
         const parametros = {
             data: { dataAtendimento, dataCriacao },
             cliente: { tamanho: atendimento.cliente.length }
         }
         const erros = this.valida(parametros)
         const existeErros = erros.length
         if(existeErros){
             return new Promise((resolve, reject) => {reject(erros)})
         }
         else{
            const atendimentoDatado = {...atendimento, dataCriacao, dataAtendimento}

            return repositorio.adiciona(atendimentoDatado)
                .then((resultados) => {
                    const id = resultados.insertId
                    return {...atendimento, id}
                })
         }
         
    }
    lista(){
         return repositorio.lista()
    }
    buscaPorId(id) {
        return repositorio.buscaPorId(id)
        .then( async (resultados) => {
            const atendimento = resultados[0]
            const cpf = atendimento.cliente
            const { data } = await axios.get(`http://localhost:8082/${cpf}`)
            atendimento.cliente = data
            return atendimento
        })
    }
    autera(id, valores) {
        if(valores.dataAtendimento){
            valores.dataAtendimento = moment(valores.dataAtendimento, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        return repositorio.autera(valores, id)
    }
    deleta(id){
        return repositorio.deleta(id)
    }
 }
 
module.exports = new Atendimentos

