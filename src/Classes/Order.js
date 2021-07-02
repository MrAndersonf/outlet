const Util = require(path.resolve(__dirname + '/../Util/index.js'))
class Order {
  constructor() {
    this._items = []
  }

  insert(order) {
    this._items.push(order)
  }

  export() {
    return this._items
  }

  clean() {
    this._items = []
  }

  table() {
    return this._items.map((order, i) => {
      return `
  <tr style="opacity:0.85;display: flex;align-items: center">
    <td scope="row" class="table_id">
      ${i}
    </td>
    <td class="table_code">
      ${order.product.code}
    </td>
    <td class="table_description">
      ${order.product.description}
    </td>
    <td class="table_quantity">
      ${order.units}
    </td>
    <td class="table_price">
      ${Util.toCurrency(order.product.price)}
    </td>
    <td class="table_total">
      ${Util.toCurrency(order.product.price * order.units)}
    </td>
    <td class="table_min">
      <div class="min_container">
        <img 
          class="miniature" 
          src="${order.product.image}" 
          alt="">
      </div>
    </td>
    <td class="table_action">
      <div>
        <input 
          type="image" 
<<<<<<< HEAD
          src="../../assets/icon/edit.svg" 
          alt="" 
          style="width: 24px" tooltip="Editar">
        <input 
          type="image" 
          src="../../assets/icon/trash.svg" 
          alt="" 
          style="width: 18px" 
=======
          src="./icon/edit-solid.svg" 
          alt="" 
          style="width: 30px" tooltip="Editar">
        <input 
          type="image" 
          src="./icon/trash-alt-solid.svg" 
          alt="" 
          style="width: 24px" 
>>>>>>> eb79f88f47c18edc1f028a8d56e57f2f09ba6a5a
          tooltip="Editar">
      </div> 
    </td>
  </tr>`
    })
  }

  total() {
    let check = 0;
    this._items.forEach(order => check += order.product.price * order.units)
    return Util.toCurrency(check)
  }





}

module.exports = Order