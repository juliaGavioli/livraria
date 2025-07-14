var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        autor: resultadoAutenticar[0].autor,
                                        titulo: resultadoAutenticar[0].titulo,
                                        compra: resultadoAutenticar[0].titulo,
                                        venda: resultadoAutenticar[0].venda,
                                        estoque: resultadoAutenticar[0].estoque
                                        // senha: resultadoAutenticar[0].senha,
                                        // aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.status(204).json({ aquarios: [] });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var autor = req.body.autorServer;
    var titulo = req.body.tituloServer;
    var compra = req.body.compraServe;
    var venda = req.body.vendaServer;
    var estoque = req.body.estoqueServe;
    var fkGenero = req.body.idGeneroVincularServer;

    // Faça as validações dos valores
    if (autor == undefined) {
        res.status(400).send("Nome do autor está undefined!");
    } else if (titulo == undefined) {
        res.status(400).send("Titulo do livro está undefined!");
    } else if (compra == undefined) {
        res.status(400).send("Seu valor de compra está indefinida!");
    } else if (venda == undefined) {
        res.status(400).send("Seu valor de venda está undefined!");
    } else if (estoque == undefined) {
        res.status(400).send("A quantidade do seu estoque está undefined!");
    } else if (fkGenero == undefined) {
        res.status(400).send("O genero do seu livro está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(titulo, autor, compra, venda, estoque, fkGenero)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}