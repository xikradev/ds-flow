# DS Flow — Clareza em movimento

## Direção criativa

O DS Flow apresenta estruturas de dados como elementos em movimento sobre uma superfície clara. Branco e azuis criam uma identidade própria, com contraste e espaço para acompanhar cada etapa. Grades sutis sugerem conexão sem competir com os dados.

## Tipografia

- **Sora** (`font-display`, `font-sans`): títulos, controles e textos de leitura.
- **IBM Plex Mono** (`font-mono`): passos, valores e metadados técnicos.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `void` | `#F2F7FC` | fundo da aplicação |
| `deep` / `panel` | `#FFFFFF` | superfícies e painéis |
| `panel-raised` | `#E8F2FC` | elementos destacados |
| `ink` | `#102F4D` | texto principal |
| `ink-muted` | `#486A85` | texto secundário |
| `signal` / `flow` | `#1769B0` | ações, foco e progresso |
| `alert` | `#986000` | atenção |
| `fault` | `#B42332` | erro e interrupção |
| `comparing` / `comparing-border` / `comparing-ink` | `#FFF1B8` / `#986000` / `#563500` | valor em comparação |
| `sorted` / `sorted-border` / `sorted-ink` | `#D6F3DC` / `#287443` / `#123C24` | valor em posição definitiva |

## Padrões

- Use branco para superfícies e azul-claro para agrupar valores; reserve o azul forte para ações e estados ativos.
- Combine cor com ícones, texto ou forma para comunicar estados. Texto sobre botões azuis deve ser branco.
- Use a fonte monoespaçada para dados técnicos e a fonte principal para explicações.
- Movimentos devem durar entre 150 e 220 ms e ilustrar deslocamento de dados. Respeite a preferência por movimento reduzido.

Os tokens vivem em `src/styles.css` e são consumidos com classes Tailwind, como `bg-panel`, `text-signal` e `font-mono`.

## Tema escuro

O tema escuro usa fundo azul-profundo (`#081827`), painéis em `#10283D` e texto claro (`#EDF6FF`). Valores usam azul médio para manter destaque, enquanto erros permanecem identificáveis com fundo vermelho escuro opaco e borda clara. O controle no cabeçalho alterna os temas e guarda a escolha no navegador. Os mesmos tokens semânticos se adaptam aos dois temas, incluindo menus e tooltips.

Todo componente visual novo deve se adaptar aos temas claro e escuro. Use os tokens semânticos de cor e verifique contraste e legibilidade nos dois temas, incluindo estados de interação, foco, desabilitado e validação. Ao introduzir uma nova cor, defina seu valor para ambos os temas.

Para valores em comparação, os tokens `comparing`, `comparing-border` e `comparing-ink` usam `#5C4200`, `#FFD36A` e `#FFF3C2` no tema escuro. Para posições definitivas, `sorted`, `sorted-border` e `sorted-ink` usam `#174D32`, `#86DCA2` e `#DDFFE8`. Combine esses destaques com símbolos e descrições textuais.
