CREATE DATABASE market_cubos

CREATE TABLE usuarios (
  id serial primary key,
  nome text NOT NULL,
  nome_loja text NOT NULL,
  email text NOT NULL,
  senha text NOT NULL
)

CREATE TABLE produtos (
  id serial primary key,
  usuario_id smallint REFERENCES usuarios(id),
  nome text NOT NULL,
  estoque smallint NOT NULL,
  categoria text NOT NULL,
  preco smallint NOT NULL,
  descricao text NOT NULL,
  imagem text NOT NULL
)