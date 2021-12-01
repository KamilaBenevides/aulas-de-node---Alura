const Atendimentos = require('../models/atendimentos')

module.exports = app => {
     app.get('/atendimentos', (req, res) => {
          Atendimentos.lista()
               .then(resultados => res.json(resultados))
               .catch(erros => res.status(400).json(erros))
     })

     app.get('/atendimentos/:id', (req, res) => { 
          const id = parseInt(req.params.id)
          Atendimentos.buscaPorId(id)
               .then(cliente => {
                    res.status(200).json(cliente)
               })
               .catch(erros => res.status(400).json(erros))
      });

     app.post('/atendimentos', (req, res) => {
          atendimentos = req.body
          Atendimentos.adiciona(atendimentos)
               .then(atendimentoCadastrado => res.status(201).json(atendimentoCadastrado))
               .catch(erros => res.status(400).json(erros))
     })
     app.patch('/atendimentos/:id', (req, res) => {
          const id = parseInt(req.params.id)
          const valores = req.body

          Atendimentos.autera(id, valores)
               .then(auterado => res.status(200).json(auterado))
               .catch(erros => res.status(400).json(erros))
     })
     app.delete('/atendimentos/:id', (req, res) => {
          const id = parseInt(req.params.id)
          Atendimentos.deleta(id)
               .then(auterado => res.status(200).json(auterado))
               .catch(erros => res.status(400).json(erros))
     })
}


