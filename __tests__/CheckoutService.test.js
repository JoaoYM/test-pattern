const { CheckoutService } = require('../src/services/CheckoutService.js');
const CarrinhoBuilder = require('../tests/builders/CarrinhoBuilder.js');
const UserMother = require('../tests/builders/UserMother.js');

describe('quando o pagamento falha', () => {
  test('deve retornar null', async () => {
    const carrinho = new CarrinhoBuilder()
      .comUser(UserMother.umUsuarioPadrao())
      .build();

    const gatewayStub = {
      cobrar: jest.fn().mockResolvedValue({ success: false }),
    };

    const pedidoRepositoryDummy = {
      salvar: jest.fn(),
    };

    const emailServiceDummy = {
      enviarEmail: jest.fn(),
    };

    const checkoutService = new CheckoutService(
      gatewayStub,
      pedidoRepositoryDummy,
      emailServiceDummy
    );

    const pedido = await checkoutService.processarPedido(
      carrinho,
      'cartao-123'
    );

    expect(pedido).toBeNull();
  });
});

describe('quando um cliente Premium finaliza a compra', () => {
  test('deve aplicar desconto de 10% e chamar email uma vez', async () => {
    const carrinho = new CarrinhoBuilder()
      .comUser(UserMother.umUsuarioPremium())
      .comItens([
        { nome: 'Produto 1', preco: 100 },
        { nome: 'Produto 2', preco: 100 },
      ])
      .build();

    const gatewayStub = {
      cobrar: jest.fn().mockResolvedValue({ success: true }),
    };

    const pedidoRepositoryStub = {
      salvar: jest.fn().mockImplementation((pedido) =>
        Promise.resolve({ ...pedido, id: 'pedido-001' })
      ),
    };

    const emailMock = {
      enviarEmail: jest.fn(),
    };

    const checkoutService = new CheckoutService(
      gatewayStub,
      pedidoRepositoryStub,
      emailMock
    );

    await checkoutService.processarPedido(carrinho, 'cartao-123');

    expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, 'cartao-123');
    expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
    expect(emailMock.enviarEmail).toHaveBeenCalledWith(
      'ana.pereira@example.com',
      'Seu Pedido foi Aprovado!',
      'Pedido pedido-001 no valor de R$180'
    );
  });
});