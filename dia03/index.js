/*
    Para evitar qualquer problema com bases de dados
    usamos uma biblioteca para manipular objetos, restringir acessos
    MongoDB
    para listar os databases existentes 
    show dbs

    O mongo é o banco de dados AMIGO dos DBs
    -> Se não houver database, ele cria
    -> Se não existir collection(table), ele cria

    use herois

    db> tudo que for manipulação de banco é feita através de collections
    //Inclusão de registros
        db.herois.insert({
            nome: 'Batman',
            poder: 'Dinheiro'
        })
        db.herois.insert({
            nome: 'Flash',
            poder: 'Velocidade'
        })

    //Busca de registros
        db.herois.find()
        db.herois.find().pretty() -> retorna um resultado formatado
        db.herois.find({
            nome: 'Batman'
        })
        db.herois.find({
            poder: {$exists: true}
        })
        //Ordenando resultados
        db.herois.find().sort({nome: -1}) // ascendente
        //Ordenando resultados
        db.herois.find().sort({nome: 1}) // descendente
        //Ocultando resultados (booleano)
        db.herois.find({}, {nome: 1, _id:0})

    db.herois.count()

    //Alteração de registro - primeiro parâmetro é o where, o segundo é o comando de atualização.
    //IMPORTANTE: tudo que não estiver na segunda declaração será REMOVIDO
    //FORMATO INCORRETO (apagar o nome)
        db.herois.update({
            _id: ObjectId("5be36d99d732dd29f9121ad8")
        }, {
            poder: 'Forte'
    })//FORMATO CORRETA (usar o $set!)
        db.herois.update({
            _id: ObjectId("5be36f02d732dd29f9121ada")
        }, {
            $set: {
            poder: 'Forte'
            }
        })


    //Remoção de registros
        db.herois.remove({
            _id: ObjectId("5be368351bf259116904095e")
        })
    //Remoção completa de registros da collection
        db.herois.remove({})

    //Execução de funções Javascript
        for(let i= 0; i <=1000; i++){
            db.herois.insert({
                nome: 'teste' + i
            })
        }

        db.dropDatabase()
*/
/*
    1) Obter endereço do usuário
    2) Obter telefone do usuário
    printar na tela Nome, telefone, endereço
*/

/*

    Exemplo de como callbacks são complicados para se trabalhar
    -- Organização de códigos
    -- Tratamento de erros
    -- Nomes de variáveis
    Em 2015 o JS começou a utilizar as Promises para resolver esse problema

    PRIMEIRO ESTADO -> new Promise() -> Pending
    SEGUNDO ESTADO -> .then() -> quando deu bom
    TERCEIRO ESTADO -> .catch() -> quando deu ruim

    Dentro das funções, toda manipulação retorna uma nova Promise

    CALLBACKS podem ser convertidos em PROMISES
    com o módulo interno do node.
    Se a função seguir a convenção de 1o parâmetro -> erro e 2o parâmetro -> sucesso.

    Dev C# criaram a feature para resolver promise na mesma linha
    a mesma ordem de código que é escrita, é executada
    1o inserir a palavra async na função
    2o inserir a palavra await na promise

*/

//DESTRUCTURING: Em vez de:
//      const util = require('util');
//      const promisify = util.promisify;
//Fazer...
const {
    promisify
} = require('util')
//Utilizamos uma propriedade da biblioteca pública do node
//Convertendo função callback para promise
const obterTelefoneAsync = promisify(telefone)

// testPromise()
//     .then(function (resultado) {
//         console.log('meu resultado', resultado);
//         return resultado + "Patata"
//     })
//     .then(function (resultado) {
//         console.log(resultado)
//     })
//     .catch(function (erro) {
//         console.log('DEU RUIM', erro)
//     })


function testPromise() {
    const promise = new Promise(function (resolve, reject) {
        setTimeout(() => {
            const meuObj = {
                nome: 'Patati'
            }
            return resolve(meuObj)
        }, 2000);
    });
    return promise;

}

function obterUsuario() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            return resolve({
                id: 1,
                nome: 'Xuxa da Silva'
            })
        }, 2000);
    });
    // setTimeout(() => {
    //     //chamando a função passada depois de ser resolvido.
    //     //Primeiro parâmetro é o que fazer em caso de erro
    //     //Segundo parâmetro é o que fazer em caso de sucesso (neste caso, enviamos o objeto)
    //     return callback(null, {
    //         id: 1,
    //         nome: 'Xuxa da Silva'
    //     })
    // }, 2000);
}
//Convenção: chamar o callback como último argumento
function endereco(idUsuario) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            return resolve({
                rua: 'rua dos bobos',
                numero: 0
            })
        }, 2000);
    })
}

function telefone(idUsuario, callback) {
    return new Promise(function (resolve, reject) {

        setTimeout(() => {
            return callback(null, {
                ddd: 11,
                telefone: '12345678'
            })
        }, 2000);
    });
    // setTimeout(() => {
    //     return callback(null, {
    //         ddd: 11,
    //         telefone: '12345678'
    //     })
    // }, 2000);
}

function resolveUser(erro, sucesso) {
    console.log('sucesso', sucesso);
}
//EXEMPLO 1
//EXEMPLO DE CALLBACK HELL
// function main() {
//     //sincronizando a chamada de usuário, enviando
//     //função que será executada somente depois do
//     //usuário ser resolvido
//     obterUsuario(function resolveUser(erro, sucesso) {
//         const user = sucesso.id;
//         //NULL, UNDEFINED, 0, '' === FALSE
//         if (erro) {
//             console.error('DEU RUIM NO USUÁRIO ' + erro);
//             //Interromper função caso haja algum erro (não haverá id para o usuário)
//             return;
//         }
//         endereco(user, function resolveAddress(erro1, sucesso1) {
//             if (erro1) {
//                 console.error('DEU RUIM NO ENDEREÇO ' + erro1);
//                 //Interromper função caso haja algum erro (não haverá id para o usuário)
//                 return;
//             }
//             telefone(user, function resolveAddress(erro2, sucesso2) {
//                 if (erro2) {
//                     console.error('DEU RUIM NO ENDEREÇO ' + erro2);
//                     //Interromper função caso haja algum erro (não haverá id para o usuário)
//                     return;
//                 }
//                 console.log(`Nome: ${sucesso.nome} Endereço: ${sucesso1.rua}, ${sucesso1.numero} Telefone: (${sucesso2.ddd}) ${sucesso2.telefone}`);
//             });
//         })
//     });
// }
// main();

//EXEMPLO 2
//EXEMPLO COM PROMISE
// function main() {
//     obterUsuario()
//         .then(function resolveUser(usuario) {
//             const resultado = endereco(usuario.id);
//             //Usando then para resolver os dependentes antes de prosseguir
//             const promiseEndereco = resultado.then(function (meuEndereco) {
//                 return {
//                     usuario: usuario,
//                     endereco: meuEndereco
//                 }
//             });
//             return promiseEndereco;
//         })
//         .then(function (resultado) {
//             return obterTelefoneAsync(resultado.usuario.id)
//                 .then(function (meuTelefone) {
//                     return {
//                         telefone: meuTelefone,
//                         // Em vez de declarar o resultado anterior de novo:
//                         //      usuario: resultado.usuario,
//                         //      telefone: resultado.telefone
//                         // Com a sintaxe das reticências obtemos todas as chaves do objeto
//                         // e fazemos um MERGE
//                         ...resultado
//                     }
//                 });

//         })
//         //BOA PRÁTICA DE DEBUG: Inserir um .then com console log
//         .then(function (resultado) {
//             console.log('final: ', resultado)
//         })
//         .catch(function (error) {
//             console.error('DEU RUIM', error)
//         })
// }
// main();



//EXEMPLO 3
//ASYNC na assinatura da função
async function main() {
    try {
        console.time('promise')
        //AWAIT está disponível desde a versão 8 do node
        const usuario = await obterUsuario()
        // const enderecoUsuario = await endereco(usuario.id)
        // const telefone = await obterTelefoneAsync(usuario.id)
        //Aprimorando a performance da execução das funções (queda de 2 segundos na execução)
        //  Na declaração da variável, definimos uma array com duas variáveis.
        //  O resultado de cada função será inserido na variável respectiva
        const [enderecoResultado, telefoneResultado] = await Promise.all([
            endereco(usuario.id),
            obterTelefoneAsync(usuario.id)
        ])
        console.log(`
            Nome: ${usuario.nome},
            Endereço: ${enderecoResultado.rua}, ${enderecoResultado.numero},
            Telefone: (${telefoneResultado.ddd}) ${telefoneResultado.telefone}`);
        console.timeEnd('promise')
    } catch (error) {
        console.error('DEU RUIM MAS MAIS BONITO', error)
    }
}
main();