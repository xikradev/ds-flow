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

## Padrões

- Use branco para superfícies e azul-claro para agrupar valores; reserve o azul forte para ações e estados ativos.
- Combine cor com ícones, texto ou forma para comunicar estados. Texto sobre botões azuis deve ser branco.
- Use a fonte monoespaçada para dados técnicos e a fonte principal para explicações.
- Movimentos devem durar entre 150 e 220 ms e ilustrar deslocamento de dados. Respeite a preferência por movimento reduzido.

Os tokens vivem em `src/styles.css` e são consumidos com classes Tailwind, como `bg-panel`, `text-signal` e `font-mono`.
