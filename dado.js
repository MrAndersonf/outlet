const jsonfile = require('jsonfile-promised');
const fs = require('fs');

module.exports = {
    salvar(codigo, quantidade, preco){
        let produto = __dirname + '/data/'+ codigo + '.json';
        if(fs.existsSync(produto)){
            return "Produto já cadastrado. Edite a quantidade na aba estoque"
        }else{
            let prod = {codigo:codigo,quantidade:quantidade,preco:preco}
            return jsonfile.writeFile(produto,prod) .then(() => {
                console.log('Arquivo Criado')
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    ,
    salvavendas(numero, itens ){
        let venda = __dirname + '/vendidos/'+ numero + '.json';
        if(fs.existsSync(venda)){
            return "Produto já cadastrado. Edite a quantidade na aba estoque"
        }else{

            return jsonfile.writeFile(venda, itens) .then(() => {
                console.log('Arquivo Criado')
            }).catch((err) => {
                console.log(err);
            });
        }
    },
    adicionaTempoAoCurso(arquivoDoCurso, tempoEstudado ){
        let dados = {
            ultimoEstudo: new Date().toString(),
            tempo: tempoEstudado
        }

        jsonfile.writeFile(arquivoDoCurso,dados, {spaces: 2})
                .then(() => {
                    console.log('Tempo salvo com sucesso');
                }).catch((err) => {
                    console.log(err);
                })
    },
    criaArquivoDeCurso(nomeArquivo, conteudoArquivo){
        return jsonfile.writeFile(nomeArquivo,conteudoArquivo)
                .then(() => {
                    console.log('Arquivo Criado')
                }).catch((err) => {
                    console.log(err);
                });
    },
    pegaDados(curso){
        let arquivoDoCurso = __dirname + '/data/'+ curso + '.json';
        return jsonfile.readFile(arquivoDoCurso);
    },
    produtos(){        
        let arquivos = fs.readdirSync(__dirname + '/data/');
        let cursos = arquivos.map((arquivo) => {
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
        });    
        return cursos
    },

    proxima_venda(){
        let arquivos = fs.readdirSync(__dirname + '/vendidos/');
        let cursos = arquivos.map((arquivo) => {
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
        });
        return cursos
    }
}
