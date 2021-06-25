
const js = require('jsonfile')
const fs = require('fs');
const ipc_dados = require("electron").ipcRenderer;
const pth = require('path')



module.exports = {
    SalvarProduto(local, item) {
        let filePath = pth.resolve(__dirname + '/data/' + local + '.json');
        if (fs.existsSync(filePath)) {
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
        let products = fs.readdirSync(__dirname + '/products/');
        return products.map(item => item.substr(0, item.lastIndexOf('.')));
    },
    save(directory, item) {
        let path = __dirname + `/${directory}/` + item.code + '.json';
        js.writeFileSync(path, item)        
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
    findByCode(directory,code) {
        return js.readFileSync(__dirname + `/${directory}/` + code + '.json');
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