const express = require('express');
const usuarios = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');
const verificaLogin = require('./filtros/verificaLogin');


const rotas = express();

// usuarios
rotas.post('/cadastro', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.logarUsuario);

rotas.use(verificaLogin);

rotas.get('/perfil', usuarios.exibirUsuario);
rotas.put('/perfil', usuarios.editarUsuario);


// produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.exibirProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.editarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;