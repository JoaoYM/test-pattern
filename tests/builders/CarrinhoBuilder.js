const { Carrinho } = require('../../src/domain/Carrinho.js');
const { Item } = require('../../src/domain/Item.js');

class CarrinhoBuilder {
  constructor() {
    this.user = null;
    this.itens = [new Item('Item Básico', 10)];
  }

  comUser(user) {
    this.user = user;
    return this;
  }

  comItens(arrayDeItens) {
    this.itens = arrayDeItens;
    return this;
  }

  vazio() {
    this.itens = [];
    return this;
  }

  build() {
    return new Carrinho(this.user, this.itens);
  }
}

module.exports = CarrinhoBuilder;
