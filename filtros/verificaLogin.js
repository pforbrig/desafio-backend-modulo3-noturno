const conexao = require('../conexao');
const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const jwtKey = require('../jwtsecret');

const pwd = securePassword()

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json("É necessário fornecer um token!")
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, jwtKey);

        const query = "select * from usuarios where id = $1";
        const usuarios = await conexao.query(query, [id]);

        if (usuarios.rowCount === 0) {
            return res.status(404).json('Usuario não encontrado.');
        }
        const { senha, ...usuario } = usuarios.rows[0];

        req.usuario = usuario;

        next();


    } catch (error) {
        res.status(400).json("O token informado é inválido.")
    }
}

module.exports = verificaLogin;
