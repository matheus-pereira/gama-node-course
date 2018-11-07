const request = require('request')
const {
    promisify
} = require('util')
//CALLBACK
// function obterPessoas(callback) {
//     request('https://swapi.co/api/people/?search=han+solo&format=json',
//         callback)
// }

// function obterNaves(urlNave, callback) {
//     request(urlNave, callback)
// }

// function main() {
//     obterPessoas(function resolvePessoas(error, sucesso) {
//         if (error) {
//             console.error('DEU RUIM NA PESSOA ' + erro);
//             //Interromper função caso haja algum erro (não haverá id para o usuário)
//             return;
//         }
//         //Bracket para pegar somente a primeira posição
//         const [people] = JSON.parse(sucesso.body).results
//         // return callback(error, people)
//         obterNaves(people.starships[0], function resolveDados(erro1, sucesso1) {
//             const starship = JSON.parse(sucesso1.body);
//             const resultado = {
//                 gender: people.gender,
//                 hair_color: people.hair_color,
//                 height: people.height,
//                 homeworld: people.homeworld,
//                 mass: people.mass,
//                 name: people.name,
//                 skin_color: people.skin_color,
//                 created: people.created,
//                 edited: people.edited,
//                 starship: {
//                     name: starship.name,
//                     model: starship.model
//                 }
//             }
//             console.log(resultado);
//         })

//     })
// }
// main()

//PROMISE
// const obterPessoasAsync = promisify(obterPessoas)
// const obterNavesAsync = promisify(obterNaves)

// function obterPessoas(callback) {
//     request('https://swapi.co/api/people/?search=han+solo&format=json',
//         callback)
// }

// //Exemplo como Promise (para economizar tempo, usamos o promisify)
// function obterPessoasPromise(callback) {
//     return new Promise(function (resolve, reject) {
//         request('https://swapi.co/api/people/?search=han+solo&format=json',
//             function (error, resultado) {
//                 resolve(resultado)
//             })
//     })
// }

// function obterNaves(urlNave, callback) {
//     request(urlNave, callback)
// }

// function main() {
//     obterPessoasAsync()
//         .then(function (consulta) {
//             const [people] = JSON.parse(consulta.body).results
//             const resultadoPessoa = {
//                 gender: people.gender,
//                 hair_color: people.hair_color,
//                 height: people.height,
//                 homeworld: people.homeworld,
//                 mass: people.mass,
//                 name: people.name,
//                 skin_color: people.skin_color,
//                 created: people.created,
//                 edited: people.edited
//             }
//             const starshipUrl = people.starships[0]
//             return obterNavesAsync(starshipUrl)
//                 .then(function (resultadoNave) {
//                     const starship = JSON.parse(resultadoNave.body)
//                     const resultadoFinal = {
//                         ...resultadoPessoa,
//                         starship: {
//                             name: starship.name,
//                             model: starship.model
//                         }
//                     }
//                     console.log(resultadoFinal)
//                 })
//         })
//         .catch(function (error) {

//         })
// }
// main()

//EXEMPLO ASYNC AWAIT
const obterPessoasAsync = promisify(obterPessoas)
const obterNavesAsync = promisify(obterNaves)

function obterPessoas(callback) {
    request('https://swapi.co/api/people/?search=han+solo&format=json',
        callback)
}

function obterNaves(urlNave, callback) {
    request(urlNave, callback)
}

async function main() {
    try {
        const consultaPessoa = await obterPessoasAsync()
        const [people] = JSON.parse(consultaPessoa.body).results
        const consultaNave = await obterNavesAsync(people.starships[0])
        const starship = JSON.parse(consultaNave.body)
        const resultado = {
            gender: people.gender,
            hair_color: people.hair_color,
            height: people.height,
            homeworld: people.homeworld,
            mass: people.mass,
            name: people.name,
            skin_color: people.skin_color,
            created: people.created,
            edited: people.edited,
            starship: {
                name: starship.name,
                model: starship.model
            }
        }
        console.log(resultado);
    } catch (error) {

    }
}
main()