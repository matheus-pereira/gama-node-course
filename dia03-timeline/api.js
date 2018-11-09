/*
    Para evitar reiniciar o código toda vez,
    instalamos uma bibilioteca para observar as modificações no projeto

    npm i -g nodemon

    nodemon api.js

    REST / RESTFUL

    REST: Seguir parte da padronização
    RESTFUL: Seguir a documentação à risca

        RESTFUL
        O padrão Restful é usado para lidar com aplicações stateless (sem estado)
        O cliente corrente não sabe a requisição anterior (não guarda sessão).

        O retorno é sempre em JSON (Javascript Object Notation
        No padrão REST usamos o padrão de respostas HTTP

        DEU BOM -> Código 200
        DEU RUIM -> Código 500
        NÃO ENCONTROU -> Código 404

        O padrão REST é uma sequência de convenções (não é um projeto)

        BASE: Publicações (resource)
    ==============================================================================================================
    AÇÃO            MÉTODO          URL                         BODY

    Cadastrar       POST            /publicacoes                {nome: usuario}
    Listar          GET             /publicacoes?limit=10
    Detalhe         GET             /publicacoes/:id
    Remover         DELETE          /publicacoes/:id
    Alterar         PATCH           /publicacoes/:id            {nome: usuario} (alteração parcial)
                    PUT             /publicacoes/:id            {nome: usuario, idade: 200} (alteração completa)
    Detalhe         GET             /publicacoes/:id/comentarios?limit=10
    Detalhe         GET             /publicacoes/:id/comentarios/:id (usado para obter)
    ==============================================================================================================
    npm i hapi
*/

// const http = require('http')
// http
//     .createServer((request, response) => {
//         response.end('Olá Node.js')
//     })
//     .listen(3000, () => console.log('servidor rodando!!'))

/*

    Para validar as requisições 
    e evitar problemas com tipagem, nome de campo ou dado obrigatório
    instalamos o JOI (Object Validation)
    npm i joi

*/
//Usando HAPI 
const Hapi = require('hapi')
//Após instalar o Joi, inserir sua chamada nas rotas
const Joi = require('joi')
//npm i boom
const Boom = require('boom')

//Importando o banco de dados
const DatabasePosts = require('./databasePosts')

function validatePostPayload() {
    return {
        description: Joi.string().required(),
        link: Joi.string().min(3).max(200),
        publishedAt: Joi.date().required(),
        user: Joi.object().keys({
            name: Joi.string().required(),
            photo: Joi.string().required().min(3).min(200)
        }),
        comments: Joi.array().required()
    }
}

function validatePatchPayload() {
    return {
        description: Joi.string(),
        link: Joi.string().min(3).max(200),
        publishedAt: Joi.date(),
        user: Joi.object().keys({
            name: Joi.string(),
            photo: Joi.string().min(3).min(200)
        }),
        comments: Joi.array()
    }
}
async function main() {
    try {
        //Inicializando o banco de dados
        const connection = DatabasePosts.conectar()
        const posts = new DatabasePosts(connection)

        //1- Instanciando servidor, passando a porta
        const app = Hapi.Server({
            port: 3000
        })

        //2- Definindo a rota (preferível deixar rotas em arquivo separado)
        app.route([
            //Criando objeto para trabalhar com a rota
            {
                //Definindo o método http
                method: 'GET',
                //Definimos o endereõ
                path: '/posts',
                //Executa alguma coisa (precisa ser aqui embaixo, junto das rotas)
                handler: async (req, h) => {
                    try {
                        //pegamos os parametros da URL
                        const {
                            limitar,
                            ignorar
                        } = req.query;
                        //Primeiro parâmetro da função listar leva o objeto para busca
                        //O segundo parâmetro passa as condições para a busca
                        const resultado = await posts
                            .listar({}, {
                                limitar,
                                ignorar
                            });
                        return resultado
                    } catch (error) {
                        console.log('DEU RUIM', error)
                        //Hapi tem um módulo interno chamado Boom, para manipular erros de conexão
                        return Boom.internal()
                    }
                },
                config: {
                    //informando configurações da rota
                    validate: {
                        /*  usamos o objeto validate para validar requisições (apoiado pelo Joi)
                            ele valida a requisição antes de chamar o handler

                            payload -> body
                            headers
                            queryString
                            params as url
                        */
                        //Caso usuário envie informação incorreta (disponível a partir do Hapi 17)
                        failAction: (request, h, err) => {
                            throw err
                        },
                        query: {
                            //Definindo argumentos para validação e um valor padrão
                            //Joi intercepta validação e evita SQL Injection
                            ignorar: Joi.number().integer().required().default(0),
                            limitar: Joi.number().integer().default(10)
                        }

                    }
                }
            },
            {
                //Definindo o método http
                method: 'GET',
                //Definimos o endereõ
                path: '/posts/{id}',
                //Executa alguma coisa (precisa ser aqui embaixo, junto das rotas)
                handler: async (request, h) => {
                    try {
                        const {
                            id
                        } = request.params
                        const resultado = await posts.listar({
                            _id: id,
                        })
                        return resultado
                    } catch (error) {

                        console.log('DEU RUIM', error)
                        return Boom.internal();
                    }
                },
                config: {
                    validate: {
                        //Caso usuário envie informação incorreta (disponível a partir do Hapi 17)
                        failAction: (request, h, err) => {
                            throw err
                        },
                        params: {
                            id: Joi.string().min(3).max(200)
                        }
                    },
                },
            },
            {
                //Definindo o método http
                method: 'GET',
                //Definimos o endereõ
                path: '/posts/{postId}/comments/{commentId}',
                //Executa alguma coisa (precisa ser aqui embaixo, junto das rotas)
                handler: async (request, h) => {
                    try {
                        const {
                            postId,
                            commentId
                        } = request.params
                        const resultado = await posts.listar({
                            _id: postId,
                            //entramos em comments e buscamos por id
                            'comments._id': commentId,
                        })
                        //usando map para mapear resultados que tem a id do comentário que buscamos
                        //resultados são buscados usando find nos comentários do post encontrado
                        const resultadoMapeado = resultado.map(item => {
                            item.comments = item.comments.find(comment => comment._id === commentId)
                            return item
                        })
                        return resultadoMapeado
                    } catch (error) {

                        console.log('DEU RUIM', error)
                        return Boom.internal();
                    }
                },
                config: {
                    validate: {
                        //Caso usuário envie informação incorreta (disponível a partir do Hapi 17)
                        failAction: (request, h, err) => {
                            throw err
                        },
                        params: {
                            postId: Joi.string().max(200).required(),
                            commentId: Joi.string().min(3).max(200)
                        }
                    },
                },
            },
            {
                //Definindo o método http
                method: 'POST',
                //Definimos o endereõ
                path: '/posts',
                //Executa alguma coisa (precisa ser aqui embaixo, junto das rotas)
                handler: async (request, h) => {
                    try {
                        const item = request.payload
                        const resultado = await posts.cadastrar(item)
                        return resultado
                    } catch (error) {

                        console.log('DEU RUIM', error)
                        return Boom.internal();
                    }
                },
                config: {
                    validate: {
                        //Caso usuário envie informação incorreta (disponível a partir do Hapi 17)
                        failAction: (request, h, err) => {
                            throw err
                        },
                        payload: validatePostPayload(),
                    },
                },
            },
            {
                //Definindo o método http
                method: 'DELETE',
                //Definimos o endereõ
                path: '/posts/{id}',
                //Executa alguma coisa (precisa ser aqui embaixo, junto das rotas)
                handler: async (request, h) => {
                    try {
                        const {
                            id
                        } = request.params
                        const resultado = await posts.remover(id)
                        return resultado
                    } catch (error) {

                        console.log('DEU RUIM', error)
                        return Boom.internal();
                    }
                },
                config: {
                    validate: {
                        //Caso usuário envie informação incorreta (disponível a partir do Hapi 17)
                        failAction: (request, h, err) => {
                            throw err
                        },
                        params: {
                            id: Joi.string().min(3).max(200)
                        }
                    },
                },
            },
            {
                method: 'PATCH',
                path: '/posts/{id}',
                handler: async (request, h) => {
                    try {
                        const {
                            id
                        } = request.params
                        const post = request.payload
                        const result = await posts.atualizar(id, post)
                        return result
                    } catch (error) {
                        console.error(error);
                        return Boom.internal()
                    }
                },
                config: {
                    validate: {
                        failAction: (request, h, error) => {
                            throw error
                        },
                        params: {
                            id: Joi.string().required().min(3).max(200),
                        },
                        payload: validatePatchPayload(),
                    },
                },
            }
        ])

        //3- Instanciar a rota
        await app.start()
        console.log(`servidor rodando, ${app.info.port}`)
    } catch (error) {
        console.error('DEU RUIM', error)
    }
}
main()