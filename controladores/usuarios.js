const conexao = require('../conexao');
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const jwtKey = require('../jwtsecret');

const pwd = securePassword()

const cadastrarUsuario = async (req, res) => {
    const { nome, nome_loja, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json('O nome é obrigatório.')
    }
    if (!nome_loja) {
        return res.status(400).json('O nome da loja é obrigatório.')
    }
    if (!senha) {
        return res.status(400).json('A senha é obrigatória.')
    }
    if (!email) {
        return res.status(400).json('O email é obrigatório.')
    }

    const validacaoEmail = await conexao.query('select * from usuarios where email = $1', [email]);
    if (validacaoEmail.rowCount > 0) {
        return res.status(400).json('Esse email já está cadastrado.')
    }
    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex")
        const query = `insert into usuarios (nome, nome_loja, email, senha) 
        values ($1, $2, $3, $4)`;
        const usuarioCadastrado = await conexao.query(query, [nome, nome_loja, email, hash]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastar o usuario');
        }

        return res.status(200).json('Usuario cadastrado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!senha) {
        return res.status(400).json('A senha é obrigatória.')
    }
    if (!email) {
        return res.status(400).json('O email é obrigatório.')
    }

    try {
        const usuarios = await conexao.query('select * from usuarios where email = $1', [email]);
        if (usuarios.rowCount === 0) {
            return res.status(404).json('Usuario não encontrado.');
        }
        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('Usuário ou senha inválidos')
            case securePassword.VALID:
                break
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex")
                    const query = `update usuarios set senha $1 
                where email $2`;
                    await conexao.query(query, [hash, email]);
                } catch (error) {
                }
                break;
        }
        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            nome_loja: usuario.nome_loja,
        }, jwtKey);

        const resposta = [{
            "usuario": {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nome_loja: usuario.nome_loja
            }, token
        }];

        return res.status(200).json(resposta);


    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const detalharUsuario = async (req, res) => {
    res.status(200).json(req.usuario);
}
const editarUsuario = async (req, res) => {
    const { nome, email, nome_loja, senha } = req.body;

    if (!nome) {
        return res.status(400).json('O nome é obrigatório.')
    }
    if (!email) {
        return res.status(400).json('O email é obrigatório.')
    }
    if (!nome_loja) {
        return res.status(400).json('O nome da loja é obrigatório.')
    }
    if (!senha) {
        return res.status(400).json('A senha é obrigatória.')
    }
    const usuarioAtual = await conexao.query('select * from usuarios where id = $1', [req.usuario.id]);

    if (usuarioAtual.rows[0].email !== email) {
        const validacaoEmail = await conexao.query('select * from usuarios where email = $1', [email]);
        if (validacaoEmail.rowCount > 0) {
            return res.status(400).json('Esse email já está cadastrado.')
        }
    }
    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = `update usuarios set 
        nome = $1,
        email = $2,
        senha = $3,
        nome_loja = $4
        where id = $5`;

        const usuarioAtualizado = await conexao.query(query, [nome, email, hash, nome_loja, req.usuario.id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o usuário');
        }

        return res.status(200).json('O usuário foi atualizado com sucesso');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}
module.exports = {
    cadastrarUsuario,
    logarUsuario,
    detalharUsuario,
    editarUsuario
}