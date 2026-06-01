class EmailService {
    async enviarEmail(para, assunto, corpo) {
        throw new Error("Não deve enviar E-mail real");
    }
}

module.exports = { EmailService };