const ipc = require("electron").ipcRenderer
const arquivo = require("./dados")

$(document).ready(() => {
    ipc.send("argumentos_busca");
    $("#quantidade_atualizar").focus();
})

ipc.on('argumentos-reply', (event, args) => {
    console.log(args);
    $("#codigo_atualizar").val(args.codigo);
    $("#preco_atualizar").val(args.preco);
    $("#quantidade_atualizar").val(args.quantidade);
})


$("#btn_atualizar_cadastrar").click(() => {
    let item = {
        codigo: $("#codigo_atualizar").val(),
        quantidade: $("#quantidade_atualizar").val(),
        preco: $("#preco_atualizar").val()
    }
    arquivo.AtualizaProduto($("#codigo_atualizar").val(), item)
    ipc, send("fechar_atualizar")
})

function Notificar(titulo, mensagem, tempo) {
    let myNotification = new Notification(titulo, {
        body: mensagem,
        timeoutType: 2000,
        icon: "./icon/hering.ico"
    })
    myNotification.show;
}

ipc.on('notificar', (event) => {
    Notificar("Sucesso", "Produto atualizado")
})