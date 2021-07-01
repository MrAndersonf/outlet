module.exports = {

  toCurrency(valueToCast) {
    return parseFloat(valueToCast)
      .toLocaleString('pt-BR',
        {
          maximumFractionDigits: 2,
          currency: "BRL",
          style: "currency"
        }
      )
  },
  currentDate() {
    return new Date()
      .toLocaleDateString('pt-BR')
      .slice(0, 10)
  },
  
}