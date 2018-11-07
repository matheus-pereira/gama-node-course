//Importando a classe databasemongodb
//para importar módulos nativos -> 'fs'
//para importar módulos do projeto -> './databaseMongoDb'
//para importar arquivos json -> './herois.json'

const DatabaseMongoDB = require('./databaseMongoDb')

async function main() {
    //Conectando com MongoDB
    const heroisDb = DatabaseMongoDB.conectar()
    //Inserindo database para 
    const database = new DatabaseMongoDB(heroisDb)
    const item = {
        nome: 'Lanterna Verde',
        poder: 'Anel'
    }
    const resultCreate = await database.cadastrar(item)
    const resultListar = await database.listar()
    console.log('resultListar', resultListar)

    const itemRemover = resultListar[0]._id
    const resultRemover = await database.remover(itemRemover)
    console.log('resultRemover', resultRemover)

    const itemAtualizar = resultListar[1]._id
    const resultAtualizar = await database
        .atualizar(itemAtualizar, {
            nome: 'Mulher Maravilha'
        })
}
main()