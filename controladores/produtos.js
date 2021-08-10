const conexao = require('../conexao');
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const jwtKey = require('../jwtsecret');

const pwd = securePassword()


const listarProdutos = async (req, res) => {
}
const exibirProduto = async (req, res) => {
}
const cadastrarProduto = async (req, res) => {
}
const atualizarProduto = async (req, res) => {
}
const excluirProduto = async (req, res) => {
}

module.exports = {
    listarProdutos,
    exibirProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}