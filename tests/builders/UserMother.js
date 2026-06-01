class UserMother {
  static umUsuarioPadrao() {
    return {
      id: 'user-001',
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      tipo: 'COMUM',
      isPremium() {
        return false;
      },
    };
  }

  static umUsuarioPremium() {
    return {
      id: 'user-002',
      nome: 'Ana Pereira',
      email: 'ana.pereira@example.com',
      tipo: 'PREMIUM',
      isPremium() {
        return true;
      },
    };
  }
}

module.exports = UserMother;
