class PedidoRepository {
    // Retorna o pedido salvo (com ID)
    async salvar(pedido) {
        throw new Error("Não deve salvar no DB real");
    }
}

module.exports = { PedidoRepository };