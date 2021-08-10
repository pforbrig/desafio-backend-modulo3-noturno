const express = require('express');
const usuarios = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');


const rotas = express();

// usuarios
rotas.post('/cadastro', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.logarUsuario);
rotas.get('/perfil', usuarios.detalharUsuario);
rotas.put('/perfil', usuarios.editarUsuario);


// produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.exibirProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;