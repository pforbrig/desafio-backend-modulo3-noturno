const conexao = require('../conexao');

const listarProdutos = async (req, res) => {
    try {
        const query = `select * from produtos where usuario_id = $1`;
        const produtosCadastrados = await conexao.query(query, [req.usuario.id]);

        if (produtosCadastrados.rowCount === 0) {
            return res.status(200).json('Você não tem produtos cadastrados.');
        }

        return res.status(200).json(produtosCadastrados.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const exibirProduto = async (req, res) => {
    try {
        const query = `select * from produtos where id = $1`;
        const produtoBuscado = await conexao.query(query, [req.params.id]);

        if (produtoBuscado.rowCount === 0) {
            return res.status(404).json('Não foi encontrado nenhum produto com o id informado.');
        }
        if (produtoBuscado.rows[0].usuario_id !== req.usuario.id) {
            return res.status(400).json('Você não tem acesso a esse produto.');
        }

        return res.status(200).json(produtoBuscado.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const cadastrarProduto = async (req, res) => {
    const { nome, estoque, preco, descricao, imagem, categoria } = req.body;

    if (!nome) {
        return res.status(400).json('O nome é obrigatório.')
    }
    if (!estoque) {
        return res.status(400).json('A quantidade em estoque é obrigatória.')
    }
    if (!preco) {
        return res.status(400).json('O preço é obrigatório.')
    }
    if (!descricao) {
        return res.status(400).json('A descrição é obrigatória')
    }
    if (isNaN(Number(estoque))) {
        return res.status(400).json('A quantidade em estoque deve ser um número.');
    }
    if (isNaN(Number(preco))) {
        return res.status(400).json('O preço deve ser um número.');
    }

    try {
        const query = `insert into produtos (usuario_id, nome, estoque, categoria, preco, descricao, imagem) 
        values ($1, $2, $3, $4, $5, $6, $7)`;
        const produtoCadastrado = await conexao.query(query, [req.usuario.id, nome, estoque, categoria, preco, descricao, imagem]);

        if (produtoCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastar o produto.');
        }

        return res.status(200).json('Produto cadastrado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
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