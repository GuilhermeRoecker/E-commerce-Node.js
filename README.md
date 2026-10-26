# E-commerce Node — prova de conceito de marketplace

Prova de conceito acadêmica de um e-commerce com múltiplas lojas, desenvolvida no início de 2025, durante a graduação em Sistemas de Informação no Unibave. A proposta foi explorar, na prática, a integração entre interface web, API, banco de dados relacional, autenticação e tarefas agendadas.

Inspirado no modelo de marketplace do Mercado Livre, o projeto reúne lojas independentes em uma mesma plataforma, com produtos e vendedores vinculados a cada empresa.

> Este repositório registra um trabalho de faculdade e o aprendizado daquele período. Tenho ciência dos bugs, das falhas de segurança e das inconsistências presentes na implementação. O projeto é um protótipo experimental, sem condições de uso em produção.

## Proposta e escopo

A ideia original previa administradores responsáveis pela plataforma, sem interferência no conteúdo das lojas, e autonomia para cada loja gerenciar seus produtos e vendedores. Para o cliente, o fluxo proposto incluía cadastro com código de verificação por e-mail, autenticação, endereço cadastrado para compra, carrinho e acompanhamento do pedido.

Também foram propostas duas automações: um único lembrete de carrinho após seis horas e notificações sobre o andamento da entrega. Essas regras representam a intenção do projeto; a implementação possui diferenças e limitações descritas abaixo.

## O que foi desenvolvido

- **Contas e autenticação:** cadastro de clientes, validações de dados, hash de senha com bcrypt e login com JWT, incluindo cookie HttpOnly.
- **Perfis de acesso:** cliente, administrador, dono de loja e vendedor, com verificações de cargo e vínculo com empresa em parte das rotas.
- **Gestão de lojas:** cadastro de empresas e vendedores vinculados às lojas.
- **Catálogo:** cadastro e consulta de produtos, categorias, estoque e upload de imagens.
- **Área do cliente:** perfil, cadastro de endereços e gerenciamento do carrinho.
- **Checkout demonstrativo:** cálculo do total, verificação e baixa de estoque, registro de pedido e pagamento simulado, além da limpeza do carrinho em uma transação no banco.
- **E-mails:** envio de código de verificação, lembretes de carrinho e notificações de mudança de status do pedido.
- **Cadastros auxiliares na API:** cupons, vínculos entre usuários e cupons, entregas e registros de controle de acesso e segurança da conta. A existência desses cadastros não significa que todos estejam integrados ao fluxo de compra.

O pagamento é apenas simulado, sem integração com gateway ou cobrança real. O acompanhamento de pedidos também é simulado por uma tarefa agendada, sem consulta a transportadoras.

## Tecnologias e organização

O backend utiliza **Node.js**, **Express** e **MySQL**, com consultas SQL por meio do `mysql2`. A interface foi construída com **HTML, CSS e JavaScript**, consumindo a API com `fetch`.

Outras dependências incluem `jsonwebtoken`, `bcrypt`, `cookie-parser`, `multer`, `nodemailer`, `node-cron`, `dotenv`, `cors` e `validator`.

```text
server.js                  Entrada da aplicação, rotas e arquivos estáticos
src/
  controllers/             Operações e regras dos recursos da API
  routes/                  Endpoints HTTP e fluxo de finalização de compra
  middleware/              Autenticação e verificações de acesso
  database/                Conexão MySQL e classes de representação de dados
  jobs/                    Tarefas de carrinho e atualização de pedidos
  uploads/                 Imagens enviadas para o catálogo
  utils/                   Utilitários de validação de documentos
public_html/               Páginas, estilos e scripts da interface
migração/server1.sql        Dump do banco utilizado no projeto
```

## Limitações conhecidas

O código foi escrito com foco na demonstração acadêmica e preserva decisões e pendências daquele momento. Entre os pontos identificados:

- **Permissões e isolamento entre lojas:** as verificações não são uniformes. O administrador possui acesso amplo no middleware, inclusive a operações sobre produtos, contrariando a restrição prevista na proposta original.
- **Autenticação e validação de compra:** a rota de finalização não aplica middleware de autenticação nem valida integralmente a propriedade dos dados recebidos. Exigir login e endereço na interface não garante essas regras na API.
- **Verificação de conta:** o código de verificação é gerado e conferido no frontend; o backend recebe o código para envio por e-mail. Esse fluxo não oferece validação segura da conta no servidor.
- **Lembrete de carrinho:** o agendamento e o cálculo de tempo não correspondem à regra de um único alerta após seis horas. A rotina altera a data de criação do carrinho e não mantém um controle definitivo de lembrete enviado.
- **Status de pedidos:** a atualização é automática e simulada, com inconsistências na comparação dos status. Não representa o andamento real de uma entrega.
- **Configuração e manutenção:** há configurações locais fixas, inconsistências entre consultas e nomes do banco, além de fluxos incompletos. Não há uma suíte de testes automatizados; o script `npm test` é apenas o padrão de erro do pacote.
- **Inicialização:** `server.js` referencia `src/routes/email.js`, arquivo ausente no repositório. Essa pendência impede a inicialização completa na versão atual.

Esses pontos são exemplos das limitações reconhecidas, e não uma auditoria completa. O repositório deve ser entendido como registro de uma experiência de aprendizado.

## Ambiente local

As orientações abaixo documentam a configuração esperada pelo código. A execução depende da resolução da pendência de inicialização descrita acima e pode encontrar outras inconsistências do protótipo.

1. Tenha Node.js com npm e MySQL disponíveis. O dump foi gerado com MySQL 8.0.
2. Instale as dependências:

   ```bash
   npm ci
   ```

3. Em um banco local dedicado ao protótipo, crie o banco `3a-prova-web-2` e importe `migração/server1.sql`. O dump inclui dados e comandos de recriação de tabelas.
4. Confira a conexão em `src/database/db.js`: host, usuário, senha e nome do banco estão definidos diretamente nesse arquivo, sem leitura de variáveis de ambiente.
5. Configure um `.env` local com valores próprios para autenticação e envio de e-mails:

   ```dotenv
   JWT_SECRET=substitua-por-um-segredo-local
   SMTP_HOST=seu-servidor-smtp
   SMTP_PORT=587
   EMAIL_USER=seu-usuario-smtp
   EMAIL_PASS=sua-senha-smtp
   NODE_ENV=development
   ```

   Algumas rotinas também possuem remetentes fixos no código. Para experimentar os e-mails, utilize um ambiente de teste SMTP.

6. Após tratar a referência ao arquivo ausente, o comando de inicialização previsto é:

   ```bash
   npm start
   ```

A interface é servida pelo próprio Express em `http://localhost:3000/html/inicio.html`. A porta 3000 está fixa no servidor e há referências a `localhost:3000` no frontend.

## Contexto acadêmico

O objetivo foi experimentar a construção de uma aplicação web com múltiplos perfis e fluxos de e-commerce, aplicando os conteúdos estudados na faculdade. Este README descreve o resultado do protótipo e suas limitações, substituindo o plano de ensino que originalmente acompanhava o repositório.
