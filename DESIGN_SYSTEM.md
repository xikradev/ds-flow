# DS Flow — Rede em fluxo

## Direção criativa

O DS Flow representa estruturas de dados como uma rede viva: nós, rotas e sinais em trânsito. A base azul-profundo dá contraste para os dados, enquanto o cobalto e o verde-água indicam interação e progresso. Esta linguagem evita roxos, gradientes arco-íris e elementos decorativos associados a plataformas de cursos.

## Tipografia

- **Sora** (`font-display`, `font-sans`): títulos, controles e textos de leitura.
- **IBM Plex Mono** (`font-mono`): passos, valores, estados do algoritmo e metadados.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `void` | `#06121F` | fundo de maior profundidade |
| `deep` | `#0B1E32` | planos principais |
| `panel` | `#102941` | cartões e painéis |
| `signal` | `#42A5FF` | ação, foco e nó ativo |
| `flow` | `#3CDBBA` | avanço e conclusão |
| `alert` | `#FFB84D` | atenção |
| `fault` | `#FF6F7D` | erro e interrupção |

## Padrões

- Mostre relações com conectores, trajetos e grupos — não apenas por cor.
- Reserve `signal` para a ação atual; use `flow` para uma etapa validada ou concluída.
- Use a fonte monoespaçada apenas para informação técnica, mantendo o texto explicativo legível.
- Movimentos devem durar entre 150 e 220 ms e ilustrar deslocamento de dados, não decoração.

Os tokens vivem em `src/styles.css` e são consumidos com Tailwind: `bg-panel`, `text-flow`, `font-mono` e similares.
