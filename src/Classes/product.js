const path = require('path')
const database = require(path.resolve(__dirname + '/../Database/index.js'))
class product {
    constructor(description, code, price, stock, image) {
        this._code = code,
            this._price = price,
            this._stock = stock,
            this._description = description,
            this._image = image
    }

    get description() {
        return this._description;
    }

    get code() {
        return this._code;
    }

    get price() {
        return this._price;
    }

    get stock() {
        return this._stock;
    }

    get image() {
        return this._image;
    }

    set description(description) {
        this._description = description;
    }

    set code(code) {
        this._code = code;
    }

    set price(price) {
        this._price = price;
    }

    set stock(stock) {
        this._stock = stock;
    }

    set image(image) {
        this._image = image;
    }

    save() {
        database.save('products',
            {
                code: this._code,
                stock: this._stock,
                image: this._image,
                price: this._price,
                description: this._description
            })
    }

    static find(code) {
        return database.findByCode('products', code)
    }
}

module.exports = product

