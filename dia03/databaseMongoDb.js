const Mongoose = require('mongoose')

class databaseMongoDb {
    constructor(heroisDb) {
        //Recebemos o modelo de dados da collection
        //Para usar os comandos do mongoose
        this.heroisDb = heroisDb
    }
    //Main garante a conexão (via Promise, e depois libera seu uso para as demais funções)
    //Esse método é preferível a inserir a conexão em um constructor
    //Static é usado para restringir o contexto (impede que a classe seja instanciada)
    static conectar() {
        //Conexão com MongoDB
        Mongoose
            .connect('mongodb://localhost:27017/herois', {
                useNewUrlParser: true
            })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('MongoDB Ativo!'))
        const HeroiSchema = new Mongoose.Schema({
            //Tudo no primeiro nível refere-se aos campos da collection
            //Dentro da chave declara-se o objeto que será armazenado
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            criadoEm: {
                type: Date,
                default: new Date()
            }
        })
        //Em projetos grandes, é recomendado usar um arquivo por model
        //Depois agrupa-los em um arquivo único
        const heroiModel = Mongoose.model('herois', HeroiSchema)

        return heroiModel
    }

    async cadastrar(item) {
        //Não esquecer de inserir async e await em funções que usam promises.
        //
        const resultCreate = await this.heroisDb.create(item)
        return resultCreate
    }
    //query = {} //Padrão é vazio
    //pagination = {ignorar:0, limitar: 10}
    listar(query = {}, pagination = {
        ignorar: 0,
        limitar: 10
    }) {
        return this.heroisDb
            .find(query)
            .skip(pagination.ignorar)
            .limit(pagination.limitar)

    }

    remover(id) {
        //Mongoose permite que declare-se somente o número, convertendo-o para ObjectId
        return this.heroisDb.deleteOne({
            _id: id
        })
    }

    atualizar(id, item) {
        return this.heroisDb.updateOne({
            _id: id
        }, {
            $set: item
        })
    }
}
//tornamos a nossa classe pública para que outros arquivos possam acessar as informações
module.exports = databaseMongoDb