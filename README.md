# Courtly Web

Plataforma web para gestão de reservas de quadras esportivas. O projeto foi construído com **Next.js 15**, **React 19** e **Tailwind CSS**, oferecendo uma vitrine online e ferramentas administrativas para proprietários de quadras.

## Funcionalidades
- **Gestão de Reservas**: controle de agendamentos com confirmações automáticas.
- **Disponibilidade em Tempo Real**: evita conflitos exibindo apenas horários livres.
- **Personalização Completa**: configuração de preços, horários e regras para cada quadra.
- **Vitrine Online**: página pública para que clientes descubram e reservem quadras.

## Tecnologias Principais
- [Next.js](https://nextjs.org/) & React
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) para componentes acessíveis
- [React Query](https://tanstack.com/query/latest) para requisições e cache de dados
- [Zod](https://zod.dev/) para validação

## Estrutura do Projeto
A organização principal segue o padrão do diretório `app` do Next.js:

```text
app/          # páginas e rotas da aplicação
components/   # componentes reutilizáveis
contexts/     # provedores de contexto
hooks/        # hooks personalizados
lib/          # integrações e utilitários de API
public/       # arquivos estáticos
styles/       # estilos globais
```

## Como Iniciar
1. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`.

## Comandos Úteis
- `npm run lint` – executa a verificação de lint.
- `npm run build` – gera a versão de produção.
