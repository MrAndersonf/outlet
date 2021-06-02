const jsp = require('jsonfile-promised')
const js = require('jsonfile')
const fs = require('fs');
const ipc_dados = require("electron").ipcRenderer;

module.exports = {
    SalvarProduto(local, item) {
        let filePath = __dirname + '/data/' + local + '.json';
        if (!fs.existsSync(filePath)) {
            js.writeFileSync(filePath, item)
        }
    },
    SalvarVenda(local, item) {
        let filePath = __dirname + '/vendidos/' + local + '.json';
        if (!fs.existsSync(filePath)) {
            js.writeFileSync(filePath, item)
        }
    },
    ChecaCadastrado(codigo) {
        let filePath = __dirname + '/data/' + codigo + '.json';
        if (fs.existsSync(filePath)) {
            let item = js.readFileSync(filePath);
            ipc_dados.send("atualiza_item", item);
        }
    },
    produtos() {
        let arquivos = fs.readdirSync(__dirname + '/data/');
        let cursos = arquivos.map((arquivo) => {
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
        });
        return cursos
    },
    vendas() {
        let arquivos = fs.readdirSync(__dirname + '/vendidos/');
        let cursos = arquivos.map((arquivo) => {
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
        });
        return cursos
    },
    buscaArquivoPorCodigo(codigo) {
        let resultado = js.readFileSync(__dirname + "/data/" + codigo + ".json");
        return resultado;
    },
    vendaPorCodigo(codigo) {
        let resultado = js.readFileSync(__dirname + "/vendidos/" + codigo + ".json");
        return resultado;
    },
    RetornaProduto(codigo) {
        let produto = js.readFileSync(__dirname + "\\data\\" + codigo + '.json');
        return produto;
    },
    RetornaVenda(codigo) {
        return js.readFileSync(__dirname + "\\vendidos\\" + codigo + '.json');
    },
    numeroDeVendas() {
        let registros = fs.readdirSync(__dirname + '/vendidos/');
        let vendas = registros.map((arquivo) => {
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
        });
        return vendas
    },
    AtualizaProduto(Local, item) {
        let filePath = __dirname + '/data/' + Local + '.json';
        js.writeFileSync(filePath, item)
        ipc_dados.send("fechar_atualizar");
    }
}