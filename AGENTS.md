# Repository Guidelines

## Project Structure & Module Organization

Este é um projeto Angular 20 com Tailwind CSS. Organize o código em `src/app/` pela arquitetura baseada em funcionalidades:

- `features/` — contextos de negócio com páginas, componentes, estado e serviços. Exemplo: `features/sorting/`.
- `shared/` — itens reutilizáveis, como `validators/`, UI, pipes, diretivas, tipos e `utils/`.
- `core/` — infraestrutura global: `services/`, clientes `http/`, guards, interceptors e configurações.

Evite dependências entre features; compartilhe por `shared/` ou `core/`. Não versione artefatos gerados, caches ou credenciais.

## Roteamento de Ordenação

As páginas de métodos de ordenação são rotas-filhas de `/sort`. O componente de layout dessa rota é responsável por renderizar persistentemente o header, o `router-outlet` central e o footer com os controles da simulação. Cada método ocupa somente a área central; por exemplo, Bubble Sort é acessado em `/sort/bubble`.

Ao adicionar um método, crie uma rota-filho de `/sort` e não replique o header ou footer na página do método. A rota `/sort` deve redirecionar para o método padrão, e rotas legadas podem redirecionar para a nova URL quando necessário.

## Build, Test, and Development Commands

Use os scripts definidos no `package.json`. Os comandos esperados para o projeto Angular são:

- `npm install` — instala as dependências.
- `npm start` — executa o servidor local.
- `npm run build` — gera a versão de produção.
- `npm test` — executa a suíte de testes.

Use sempre classes utilitárias do Tailwind para desenvolver estilos de interface. Evite CSS isolado em componentes; mantenha no stylesheet global apenas tokens de tema, fontes e estilos base indispensáveis.

## UI/UX

Antes de desenvolver ou alterar qualquer interface, experiência ou interação visual, leia o arquivo `DESIGN_SYSTEM.md` e siga as diretrizes definidas nele.

## Coding Style & Naming Conventions

Siga as convenções do Angular e a configuração de formatter/linter do repositório. Use 2 espaços. Nomeie arquivos em `kebab-case`, por exemplo `sorting-controls.component.ts`, e classes, componentes, serviços e interfaces em `PascalCase`. Mantenha componentes pequenos e nomes explícitos.

Não coloque lógica de domínio em componentes de UI. Extraia ordenação, etapas e reprodução para serviços ou estado da feature.

## Testing Guidelines

Crie testes junto aos arquivos testados, usando `*.spec.ts`, como `bubble-sort.service.spec.ts`. Cubra comportamentos novos e regressões, especialmente a sequência de ordenação e os controles de etapas. Execute `npm test` antes de abrir uma alteração.

## Regra de Negócio do MVP

A plataforma permite ao usuário interagir visualmente com estruturas de dados. Neste MVP, a feature principal é a ordenação por `bubble sort`, `section sort` e `selection sort`.

O header permite selecionar a estrutura ou método. A área central mostra os valores como quadrados numerados e torna visível cada mudança. O footer contém o painel de simulação: pausar, avançar uma etapa e voltar uma etapa. Cada passo deve preservar o histórico para permitir a navegação sem perder o estado visual.

## Commit & Pull Request Guidelines

Use commits curtos e imperativos no padrão Conventional Commits, como `feat: add sorting controls`. Mantenha cada commit focado.

Pull requests devem explicar a mudança, registrar os testes, vincular issues e incluir capturas de tela para mudanças visuais. Não inclua segredos.
