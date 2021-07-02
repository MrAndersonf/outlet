const path = require('path')
const database = require(path.resolve(__dirname + '/../Database/index.js'))

class Sell {
  constructor(client, order, amount, payment) {
    this._amount = amount;
    this._client = client;
    this._date = new Date();
    this._order = order;
    this._payment = payment;
  }

  get client() {
    return this._client;
  }

  get date() {
    return this._date;
  }

  get order() {
    return this._order;
  }

  get amount() {
    return this._amount;
  }

  get payment() {
    return this._payment;
  }

  set client(client) {
    this._client = client
  }

  set order(order) {
    this._order = order
  }

  set amount(amount) {
    this._amount = amount
  }

  set payment(payment) {
    this._payment = payment
  }

  save() {
    database.save('sells',
      {
        client: this._client,
        date: this._date,
        order: this._order,
        amount: this._amount,
        payment: this._payment
      }
    )
  }

  static find(code) {
    return database.findByCode('sells', code)
  }

  static next() {
    return database.ticket('sells')
  }
  
}

module.exports = Sell