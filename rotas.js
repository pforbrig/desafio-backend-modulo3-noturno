const express = require('express');
const usuarios = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');


const rotas = express();

// usuarios
rotas.post('/cadastro', usuarios.cadastrarUsuario);
rotas.get('/login', usuarios.logarUsuario);
rotas.get('/perfil', usuarios.exibirUsuario);
rotas.put('/perfil', usuarios.atualizarUsuario);


// produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.exibirProduto);
rotas.post('/produtos', emprestimos.cadastrarProduto);
rotas.put('/produtos/:id', emprestimos.atualizarProduto);
rotas.delete('/produtos/:id', emprestimos.excluirProduto);

module.exports = rotas;