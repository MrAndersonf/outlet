const { ipcRenderer } = require("electron");
const { dialog } = require("electron").remote;
const path = require('path')
const Product = require(path.resolve(__dirname + '/../../' + 'Classes/Product.js'))
const Util = require(path.resolve(__dirname + '/../../Util/index.js'))
const data = require(path.resolve(__dirname + '/../../Database/index.js'))
const Sell = require(path.resolve(__dirname + '/../../' + 'Classes/Sell.js'))
const Order = require(path.resolve(__dirname + '/../../' + 'Classes/Order.js'))

let id = $("#order_id");
let today = $("#order_date")
let code = $("#order_code");
let stock = $("#order_stock");
let price = $("#order_price");
let image = $("#order_image");
let cart = $("#tabela_venda")
let quantity = $("#order_quantity");
let unmasked_price = $("#unmasked_price")
let description = $("#order_description")
let generalTotal = $("#order_check_value")


let itensSacola = []
let cartItems = new Order()


$(() => {
  id.val(Sell.next())
  today.val(Util.currentDate());
  $("#exampleModal").modal('show')
  generalTotal.val("11")
});

function AtualizaEstoque() {
  $("#vendido_tabela").empty()
  let total = 0;
  let vends = data.produtos()
  let to = [];
  vends.forEach(element => {
    let s = data.buscaArquivoPorCodigo(element)
    to.push(s);
  });
  console.log(to)
  to.forEach(function (current, index) {

    total += current.total;
    let s = `
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${current.data}</td>
              <td>${current.codigo}</td>
              <td>${current.quantidade}</td>
              <td>${code}</td>
              <td>${current.quantidade - vendidosPorCodigo(current.codigo)}</td>            
            </tr>`
    $("#tabela_produtos").append(s)


  })
}


function loadProduct(code) {
  let product = Product.find(code);
  unmasked_price.val(product.price)
  price.val(Util.toCurrency(product.price))
  stock.val(product.stock);
  image.attr('src', product.image);
  description.val(product.description)
}

function checaExistencia(codigo) {
  data.ChecaCadastrado(codigo)
}



function vendidosPorCodigo(codigo) {
  let total = 0;
  let vendas = []
  let registros = data.numeroDeVendas()
  registros.forEach(element => {
    let venda = data.RetornaVenda(element);
    vendas.push(venda);
  });
  vendas.forEach(function (current, index) {
    current.itens.forEach(function (inf, a) {
      if (inf.codigo == codigo) {
        total += parseInt(inf.quantidade);
      }
    })
  })
  return parseInt(total);
}



function QuantidadeDisponivel() {
  let quantidadeMaxima = $("#order_stock").val();
  if (quantidadeMaxima <= 0 || quantidadeMaxima == "") {
    Notificar("Alerta", "Digite o código de barras de um produto válido ");
    $("#codigo_produto_venda").val("");
    $("#codigo_produto_venda").focus();
  } else {
    $("#order_quantity").attr("max", quantidadeMaxima);
  }
}


function QuantidadeEscolhida(quantidade) {
  let quantidadeMaxima = parseInt($("#order_stock").val());
  if (parseInt(quantidade) > quantidadeMaxima) {
    Notificar("Alerta", `A quantidade máxima disponivel é ${quantidadeMaxima}`, 0);
    $("#order_quantity").val();
    $("#order_quantity").focus();
  } else {
    saldoSacola(quantidade);
  }
}


function saldoSacola(quantidade) {
  let codigo = $("#codigo_produto_venda").val();
  let estoque = parseInt($("#order_stock").val())
  itensSacola.forEach(function (val, index) {
    if (codigo == val.codigo)
      quantidade += parseInt(val.quantidade)
  })
  if (quantidade > estoque) {
    $("#order_quantity_saldo").val("");
    Notificar("Alerta", "A soma dos itens excede o estoque total")
  } else {

    let sub = $("#order_quantity").val() * unmasked_price.val();
    $("#order_subtotal").val(Util.toCurrency(sub))
  }
}

function meanOfPayment(forma) {
  if (forma == "Dinheiro") {
    SelecioneDinheiro()
    return;
  }
  if (forma == "") {
    SelecioneVazio();
    return;
  }
  if (forma == "Debito") {
    SelecioneDebito()
    return;
  }
  if (forma == "Outra") {
    SelecioneOutra()
    return;
  }
  if (forma == "Credito") {
    SelecioneCredito()
    return;
  }


}




function insertIntoCart() {
  let product = Product.find(code.val())
  let units = quantity.val()
  cartItems.insert({ product, units })


  cart.children().remove()
  cart.append(cartItems.table())
  limpaFormulario();
  generalTotal.val(cartItems.total());


}

function calculaTotalSacola() {
  let geral = 0;
  itensSacola.forEach(el => {
    geral += el.total
  })
  return parseFloat(geral).toFixed(2)
}

function limpaFormulario() {
  $("#codigo_produto_venda").val("");
  $("#order_quantity").val("");
  $("#order_price").val("");
  $("#order_stock").val("");
  $("#order_subtotal").val("");
  $("#codigo_produto_venda").focus();
}

function limpaFormularioGeral() {
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  dinheiro.val("")
  credito.val("")
  debito.val("")
  debito.attr("disabled", true);
  credito.attr("disabled", true);
  dinheiro.attr("disabled", true);
  $("#codigo_produto_venda").val("");
  $("#order_quantity").val("");
  $("#order_price").val("");
  $("#order_stock").val("");
  $("#order_subtotal").val("");
  $("#codigo_produto_venda").focus();
  $("#venda_forma_pagamento").val($('option:contains("")').val());
  $("#venda_forma_pagamento").attr("disabled", true);
  itensSacola = []
  $("#tabela_venda").empty()
  $("#order_subtotal").val("")

  geraNumeroDaVenda()
}


function finalizaVenda() {
  limpaFormulario()
  $("#venda_forma_pagamento").attr("disabled", false);
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  dinheiro.val("")
  credito.val("")
  debito.val("")
  debito.attr("disabled", false);
  credito.attr("disabled", false);
  dinheiro.attr("disabled", false);
  $("#venda_forma_pagamento").focus()


}

function SelecioneDinheiro() {
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  debito.val("");
  credito.val("");
  credito.attr("disabled", true);
  debito.attr("disabled", true);
  dinheiro.attr("disabled", false);
  let valor = $("#order_subtotal").val()
  dinheiro.val(parseFloat(valor).toFixed(2))
}


function SelecioneVazio() {
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  debito.val("");
  credito.val("");
  dinheiro.val("");
  credito.attr("disabled", true);
  debito.attr("disabled", true);
  dinheiro.attr("disabled", true);
}



function SelecioneCredito() {
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  debito.val("");
  dinheiro.val("");
  credito.attr("disabled", false);
  debito.attr("disabled", true);
  dinheiro.attr("disabled", true);
  let valor = $("#order_subtotal").val()
  credito.val(parseFloat(valor).toFixed(2))
}


function SelecioneDebito() {
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  credito.val("");
  dinheiro.val("");
  debito.attr("disabled", false);
  credito.attr("disabled", true);
  dinheiro.attr("disabled", true);
  let valor = $("#order_subtotal").val()
  debito.val(parseFloat(valor).toFixed(2))
}

function SelecioneOutra() {
  let dinheiro = $("#pagamentoDinheiro")
  let credito = $("#pagamentoCredito")
  let debito = $("#pagamentoDebito")
  dinheiro.val("")
  credito.val("")
  debito.val("")
  debito.attr("disabled", false);
  credito.attr("disabled", false);
  dinheiro.attr("disabled", false);
  dinheiro.focus()

}

function pagarFinalizar() {
  $("#exam").modal('show')
  let formaDePagamento = $("#venda_forma_pagamento").val();
  if (formaDePagamento == "")
    Notificar("Alerta", "Selecione forma de pagamento", 0)
  if (formaDePagamento == "Dinheiro")
    data.SalvarVenda($("#order_id").val(), PagarDinheiro());
  if (formaDePagamento == "Debito")
    data.SalvarVenda($("#order_id").val(), PagarDebito());
  if (formaDePagamento == "Credito")
    data.SalvarVenda($("#order_id").val(), PagarCredito());
  if (formaDePagamento == "Outra")
    data.SalvarVenda($("#order_id").val(), Pagaroutros());
  limpaFormularioGeral()
  Notificar("Sucesso", "Venda salva com sucesso.", 0);
}


function PagarDinheiro() {
  let valor = $("#order_subtotal").val()
  let venda = {
    data: currentDate(),
    itens: itensSacola,
    pagamento: [{
      forma: "Dinheiro",
      valor: parseFloat(valor).toFixed(2)
    }]
  }
  console.log(venda)
  return venda;
}

function PagarDebito() {
  let valor = $("#order_subtotal").val()
  let venda = {
    data: currentDate(),
    itens: itensSacola,
    pagamento: [{
      forma: "Débito",
      valor: parseFloat(valor).toFixed(2)
    }]
  }

  return venda;
}

function PagarCredito() {
  let valor = $("#order_subtotal").val()
  let venda = {
    data: currentDate(),
    itens: itensSacola,
    pagamento: [{
      forma: "Crédito",
      valor: parseFloat(valor).toFixed(2)
    }]
  }
  console.log(venda)
  return venda;
}

function Pagaroutros() {
  let total = 0;
  let dinheiro = $("#pagamentoDinheiro").val()
  let cartao = $("#pagamentoCredito").val()
  let debito = $("#pagamentoDebito").val()
  let valor = $("#order_subtotal").val()
  console.log(total)
  console.log(valor)
  if (dinheiro == "") {
    dinheiro = 0;
  }
  if (cartao == "") {
    cartao = 0;
  }
  if (debito == "") {
    debito = 0;
  }

  total = Number(dinheiro) + Number(cartao) + Number(debito)
  console.log(total)
  console.log(valor)
  if (valor != total) {
    Notificar("Alerta", "A soma dos campos está errada", 0);
    return;
  }
  if (cartao > 0 && dinheiro > 0 && debito == 0) {
    let venda = {
      data: currentDate(),
      itens: itensSacola,
      pagamento: [{

        forma: "Dinheiro",
        valor: parseFloat(dinheiro).toFixed(2),


      }, {

        forma: "Crédito",
        valor: parseFloat(cartao).toFixed(2)

      }]
    }
    return venda;
  }
  if (cartao == 0 && dinheiro > 0 && debito > 0) {
    let venda = {
      data: currentDate(),
      itens: itensSacola,
      pagamento: [{
        forma: "Dinheiro",
        valor: parseFloat(dinheiro).toFixed(2)
      }, {
        forma: "Débito",
        valor: parseFloat(debito).toFixed(2)
      }]
    }
    return venda;
  }
  if (cartao > 0 && dinheiro > 0 && debito > 0) {
    let venda = {
      data: currentDate(),
      itens: itensSacola,
      pagamento: [{

        forma: "Dinheiro",
        valor: parseFloat(dinheiro).toFixed(2)
      }, {
        forma: "Débito",
        valor: parseFloat(debito).toFixed(2)
      }, {
        forma: "Crédito",
        valor: parseFloat(cartao).toFixed(2)
      }]
    }
    return venda;
  }
  if (cartao > 0 && dinheiro == 0 && debito > 0) {
    let venda = {
      data: currentDate(),
      itens: itensSacola,
      pagamento: [{
        forma: "Crédito",
        valor: parseFloat(credito).toFixed(2)
      }, {
        forma: "Dédito",
        valor: parseFloat(cartao).toFixed(2)
      }]
    }
  }
  console.log(venda)
  return venda;
}




function AtualizaVendidos() {
  $("#vendido_tabela").empty()
  let total = 0;
  let vends = data.numeroDeVendas()
  let to = [];
  vends.forEach(element => {
    let s = data.vendaPorCodigo(element);
    to.push(s);
  });
  console.log(to)
  to.forEach(function (current, index) {
    current["itens"].forEach(function (inf, a, l) {
      total += inf.total;

      let s = `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${current.data}</td>
                <td>${inf.codigo}</td>
                <td>${inf.quantidade}</td>
                <td>${parseFloat(inf.unitario).toFixed(2)}</td>
                <td>${parseFloat(inf.total).toFixed(2)}</td>            
            </tr>`
      $("#vendido_tabela").append(s)
      $("#vendidos_order_subtotal").text(parseFloat(total).toFixed(2))
    })

  })
}




function filtrarVendidos() {
  let formaDePagamento = $("#fin_forma_pagamento").val();
  let dataCompra = $("#fin_data_compra").val();
  console.log(dataCompra)
  console.log(formaDePagamento)
  if (dataCompra.length == 10 && formaDePagamento != "") {
    buscaDataFormaDePagamento(dataCompra, formaDePagamento)
    return;
  }
  if (dataCompra == "" && formaDePagamento != "") {
    buscaFormaDePagamento(formaDePagamento)
    return;
  }
  if (dataCompra.length == 10 && formaDePagamento == "") {
    buscaPorData(dataCompra)
    return;
  }
  if (dataCompra == "" && formaDePagamento == "") {
    buscaGeral()
    return;
  }

}



function Notificar(titulo, mensagem, tempo) {
  let myNotification = new Notification(titulo, {
    body: mensagem,
    timeoutType: 2000,
    icon: "./icon/hering.ico"
  })
  myNotification.show;
}

function buscaGeral() {
  $("#fin_tabela").empty()
  $("#fin_order_subtotal").text("")
  let linha = "";
  let total = 0;
  let idDasVendas = data.numeroDeVendas()
  let arrayVendas = [];
  idDasVendas.forEach(element => {
    let venda = data.vendaPorCodigo(element);
    arrayVendas.push(venda);
  });
  arrayVendas.forEach(function (obj, index) {
    let larguraItens = 0
    let totalVendaAtual = 0
    larguraItens = obj.itens.length
    obj.pagamento.forEach(function (pagamento) {
      total += Number(pagamento.valor)
      totalVendaAtual += Number(pagamento.valor)
    })
    obj.itens.forEach(function (item, indexItens) {
      if (larguraItens > 1) {
        linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td rowspan="${larguraItens}">${totalVendaAtual}</td>
                        </tr>`
        console.log("Novo valor de itens " + larguraItens)
      }
      if (larguraItens == 0) {
        console.log("segunda")
        console.log(item.codigo + " - " + indexItens)
        linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>                                        
                        </tr>`
      }
      if (larguraItens == 1) {
        console.log("teceira")
        console.log(item.codigo + " - " + indexItens)
        linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td>${parseFloat(totalVendaAtual).toFixed(2)}</td>
                        </tr>`
      }
      $("#fin_tabela").append(linha)
      $("#fin_order_subtotal").text(parseFloat(total).toFixed(2))
      if (larguraItens > 1)
        larguraItens = 0
    })

  })
}

function buscaPorData(dia) {
  $("#fin_tabela").empty()
  $("#fin_order_subtotal").text("")
  let linha = "";
  let total = 0;
  let idDasVendas = data.numeroDeVendas()
  let arrayVendas = [];
  idDasVendas.forEach(element => {
    let venda = data.vendaPorCodigo(element);
    arrayVendas.push(venda);
  });
  arrayVendas.forEach(function (obj, index) {
    if (obj.data == dia) {
      let larguraItens = 0
      let totalVendaAtual = 0
      larguraItens = obj.itens.length
      obj.pagamento.forEach(function (pagamento) {
        total += Number(pagamento.valor)
        totalVendaAtual += Number(pagamento.valor)
      })
      obj.itens.forEach(function (item, indexItens) {
        if (larguraItens > 1) {
          linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td rowspan="${larguraItens}">${totalVendaAtual}</td>
                        </tr>`
          console.log("Novo valor de itens " + larguraItens)
        }
        if (larguraItens == 0) {
          console.log("segunda")
          console.log(item.codigo + " - " + indexItens)
          linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>                                        
                        </tr>`
        }
        if (larguraItens == 1) {
          console.log("teceira")
          console.log(item.codigo + " - " + indexItens)
          linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td>${parseFloat(totalVendaAtual).toFixed(2)}</td>
                        </tr>`
        }
        $("#fin_tabela").append(linha)
        $("#fin_order_subtotal").text(parseFloat(total).toFixed(2))
        if (larguraItens > 1)
          larguraItens = 0
      })
    }
  })

}


function buscaFormaDePagamento(forma) {
  $("#fin_tabela").empty()
  $("#fin_order_subtotal").text("")
  let linha = "";
  let total = 0;
  let idDasVendas = data.numeroDeVendas()
  let arrayVendas = [];
  idDasVendas.forEach(element => {
    let venda = data.vendaPorCodigo(element);
    arrayVendas.push(venda);
  });
  arrayVendas.forEach(function (obj, index) {
    let larguraItens = 0
    larguraItens = obj.itens.length
    obj.pagamento.forEach(function (pagamento) {
      if (pagamento.forma == forma) {
        total += Number(pagamento.valor)
        obj.itens.forEach(function (item, indexItens) {
          if (larguraItens > 1) {
            console.log("Itens maiores que 1")
            linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td rowspan="${larguraItens}">${pagamento.valor}</td>
                        </tr>`

            console.log("Novo valor de itens " + larguraItens)

          }
          if (larguraItens == 0) {
            console.log("segunda")
            console.log(item.codigo + " - " + indexItens)
            linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>                                        
                        </tr>`

          }
          if (larguraItens == 1) {
            console.log("teceira")
            console.log(item.codigo + " - " + indexItens)
            linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td>${parseFloat(pagamento.valor).toFixed(2)}</td>
                        </tr>`
          }
          $("#fin_tabela").append(linha)
          $("#fin_order_subtotal").text(parseFloat(total).toFixed(2))
          if (larguraItens > 1)
            larguraItens = 0
        })
      }
    })
  })
}


function buscaDataFormaDePagamento(dia, forma) {
  $("#fin_tabela").empty()
  $("#fin_order_subtotal").text("")
  let linha = "";
  let total = 0;
  let idDasVendas = data.numeroDeVendas()
  let arrayVendas = [];
  idDasVendas.forEach(element => {
    let venda = data.vendaPorCodigo(element);
    arrayVendas.push(venda);
  });
  arrayVendas.forEach(function (obj, index) {
    let larguraItens = 0
    larguraItens = obj.itens.length
    obj.pagamento.forEach(function (pagamento) {
      if (pagamento.forma == forma && obj.data == dia) {
        total += Number(pagamento.valor)
        obj.itens.forEach(function (item, indexItens) {
          if (larguraItens > 1) {
            linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td rowspan="${larguraItens}">${pagamento.valor}</td>
                        </tr>`
            console.log("Novo valor de itens " + larguraItens)
          }
          if (larguraItens == 0) {
            console.log("segunda")
            console.log(item.codigo + " - " + indexItens)
            linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>                                        
                        </tr>`
          }
          if (larguraItens == 1) {
            console.log("teceira")
            console.log(item.codigo + " - " + indexItens)
            linha = ` 
                        <tr>
                        <td>${index + 1}</td>                                                                       
                        <td>${obj.data}</td>
                        <td>${item.codigo}</td>
                        <td>${item.quantidade}</td>
                        <td>${parseFloat(item.unitario).toFixed(2)}</td>
                        <td>${parseFloat(item.total).toFixed(2)}</td>
                        <td>${parseFloat(pagamento.valor).toFixed(2)}</td>
                        </tr>`
          }
          $("#fin_tabela").append(linha)
          $("#fin_order_subtotal").text(parseFloat(total).toFixed(2))
          if (larguraItens > 1)
            larguraItens = 0
        })
      }
    })
  })
}

function selectProductImage() {
  let file = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
      { name: 'Custom File Type', extensions: ['as'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  console.log(file)
}