//Importando o módulo filesystem para manipular arquivos
const {
    readFile,
    writeFile
} = require('fs')
const {
    promisify
} = require('util')

//Convertendo funcionalidades para promise (são callback)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

class Database {
    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDados() {
        //Executando promisify com nome do arquivo (importante async e await na declaração da funções)
        const dados = await readFileAsync(this.NOME_ARQUIVO);

        //PARSE transforma um texto em um objeto JavaScript
        const dadosFormatados = JSON.parse(dados.toString())

        return dadosFormatados
    }

    async escreverDados(dados) {
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados))
    }

    async cadastrar(dado) {
        const items = await this.obterDados()
        items.push(dado)
        return this.escreverDados(items)
    }

    listar() {
        return this.obterDados();
    }

}
//Async inserido para usar promise
async function main() {
    const database = new Database();
    const heroi = {
        nome: 'Batman',
        poder: 'Dinheiro'
    }
    await database.cadastrar(heroi)
    const dados = await database.listar();
    console.log(dados);
}

main();