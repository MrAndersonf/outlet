module.exports = {

	toCurrency(valueToCast) {
		return parseFloat(valueToCast)
			.toLocaleString('pt-BR',
				{
					maximumFractionDigits: 2,
					currency: "BRL",
					style: "currency"
				})
	}
}