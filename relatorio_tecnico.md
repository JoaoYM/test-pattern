# Relatório Técnico — Decisões de Design

Este documento resume as decisões de design aplicadas aos arquivos `CarrinhoBuilder.js`, `UserMother.js` e `CheckoutService.test.js`, com foco em padrões de criação de dados e test doubles.

## 1. Padrões de Criação de Dados (Builders)

### Justificativa
Usamos o padrão Data Builder (`CarrinhoBuilder`) porque os testes exigem variações do mesmo objeto de domínio (`Carrinho`) com diferentes combinações de usuário (premium/comum) e lista de itens. O Builder fornece:
- Uma API fluente e expressiva (`.comUser()`, `.comItens()`, `.vazio()`), que torna o setup orientado por intenção;
- Valores padrão centralizados e reutilizáveis, reduzindo duplicação;
- Facilidade para compor variações mínimas sem expor detalhes de implementação do construtor de `Carrinho`.

O padrão Object Mother seria aceitável para objetos estáticos e cenários simples, mas tende a crescer em complexidade quando muitas combinações são necessárias — levando a uma API inchada e menos flexível. O Builder escala melhor para composições e variações finas.

### Antes e Depois (exemplo)

Antes — setup manual poluído (test smell: Obscure Setup):

```js
// Antes: setup poluído dentro do teste
test('cliente premium — manual setup poluído', async () => {
  const user = {
    id: 'u1', nome: 'Ana', email: 'ana@x.com', tipo: 'PREMIUM',
    isPremium() { return true; }
  };

  const itens = [
    { nome: 'Produto 1', preco: 100, sku: 'p1' },
    { nome: 'Produto 2', preco: 100, sku: 'p2' }
  ];

  const carrinho = new Carrinho(user, itens);

  // ... lógica do teste misturada com setup ...
});
```

Depois — usando `CarrinhoBuilder` (setup claro e intencional):

```js
// Depois: usando CarrinhoBuilder
test('cliente premium — usando CarrinhoBuilder', async () => {
  const carrinho = new CarrinhoBuilder()
    .comUser(UserMother.umUsuarioPremium())
    .comItens([
      { nome: 'Produto 1', preco: 100 },
      { nome: 'Produto 2', preco: 100 }
    ])
    .build();

  // ... foco na assertiva / comportamento do teste ...
});
```

### Benefícios
- Legibilidade: intenções do teste ficam explícitas.
- Menos duplicação: valores padrão e helpers centralizados.
- Facilidade de manutenção: mudança no modelo de `Carrinho` exigirá alteração apenas no `CarrinhoBuilder`.
- Menor acoplamento entre testes e a estrutura interna dos objetos de domínio.

## 2. Padrões de Test Doubles (Mocks vs. Stubs)

### Identificação no teste "sucesso Premium"
- `gatewayStub` (`cobrar: jest.fn().mockResolvedValue({ success: true })`) — Stub.
- `pedidoRepositoryStub` (`salvar: jest.fn().mockImplementation(...)`) — Stub (fornece o pedido salvo com `id`).
- `emailMock` (`enviarEmail: jest.fn()`) — Mock.

### Comportamento vs. Estado
- Gateway como **Stub (Estado)**: o gateway de pagamento precisa fornecer uma resposta determinística para que o fluxo continue (por exemplo `{ success: true }`). Seu papel é controlar o estado do domínio sob teste — isolar a dependência externa e garantir que o código sob teste receba os dados esperados. A verificação principal sobre o gateway é que ele recebeu a chamada correta com o valor esperado, mas a motivação primária é prover um resultado determinístico.

- EmailService como **Mock (Comportamento)**: o envio de e-mail representa um efeito colateral observável que deve ocorrer como consequência do processamento bem-sucedido. É importante verificar não apenas que o método foi chamado, mas com quais argumentos (destinatário, assunto, corpo). Por isso o `EmailService` assume papel de mock, permitindo verificações de interação (`toHaveBeenCalledTimes`, `toHaveBeenCalledWith`).

## 3. Conclusão

A combinação de Builders para criação de dados e de Test Doubles bem escolhidos previne Test Smells como Obscure Setup e Fragile Tests. Builders concentram a complexidade de criação em um único ponto, deixando os testes curtos e intencionais. Stubs garantem condições determinísticas ao simular respostas externas, enquanto Mocks permitem verificar efeitos colaterais e interações importantes. Juntos, esses padrões tornam a suíte de testes mais legível, menos frágil às mudanças do domínio e mais fácil de manter ao longo do tempo.

---

Arquivos de referência no repositório:
- `src/domain/Carrinho.js`
- `__tests__/CheckoutService.test.js`
- `tests/builders/CarrinhoBuilder.js`
- `tests/builders/UserMother.js`


