const path = require('path')
const database = require(path.resolve(__dirname+'/../dados.js'))
class client{
    constructor(identification,name,cellphone,email,address){
        this._identification = identification;
        this._name = name;
        this._cellphone = cellphone;
        this._email = email;
        this._address = address
    }

    get identification(){
        return this._identification
    }

    get name(){
        return this._name
    }

    get cellphone(){
        return this._cellphone
    }

    get email(){
        return this._email
    }

    get address(){
        return this._address
    }

    set identification(identification){
        this._identification = identification
    }

    set name(name){
        this._name = name
    }

    set cellphone(cellphone){
        this._cellphone = cellphone
    }

    set email(email){
        this._email = email
    }

    set address(address){
        this._address = address
    }

    save(){
        database.save('client', 
        {
            stock:this._stock,
            price: this._price, 
            description:this._description, 
            identification:this._identification
        });
    }

    



}