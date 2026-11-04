# Tarefas — fluxo de Bubble Sort

Cada tarefa é uma entrega pequena e verificável. Marque-a como concluída somente após implementar e validar o comportamento descrito. As tarefas seguem uma ordem sugerida; a implementação deve respeitar o README da feature e o design system.

## Comportamento acordado

- Start inicia ou retoma a reprodução; Pause a interrompe. Ao concluir, o botão passa a ser Restart, que restaura a lista original e inicia uma nova reprodução.
- Os valores comparados (`i` e `i + 1`) ficam amarelos; os valores em posição definitiva ficam verdes. Ao finalizar, todos ficam verdes.
- Avançar ou voltar manualmente pausa a reprodução e restaura integralmente a etapa, inclusive as indicações visuais.
- Adicionar, editar e excluir valores ficam desabilitados durante a execução e enquanto ela estiver pausada. Após a conclusão, uma edição prepara uma nova simulação.
- Start fica desabilitado quando há menos de dois valores.
- Cada etapa preserva o histórico, e as interfaces funcionam nos temas claro e escuro, sem depender exclusivamente da cor para comunicar estado.

## Entregas

- [x] **1. Modelar etapas da simulação.** Definir tipos imutáveis para uma etapa, com itens e IDs, índices comparados, posições ordenadas e indicação de troca. Definir os estados de reprodução e os limites do histórico. Validar que valores repetidos mantêm identidades distintas.

- [x] **2. Gerar etapas do Bubble Sort.** Implementar um serviço dedicado à sequência de comparações, trocas e marcação de posições definitivas, sem lógica de algoritmo nos componentes. Cobrir listas ordenadas, invertidas, com repetidos e casos de zero ou um item.

- [x] **3. Preparar a lista para restauração.** Ampliar `SortingListService` com operações necessárias para aplicar e restaurar snapshots preservando IDs, mantendo-o como fonte única da lista exibida. Testar restauração e identidade dos itens.

- [x] **4. Implementar histórico e navegação.** Criar o estado da simulação com signals, etapa atual e histórico imutável. Implementar avanço e retorno, restaurando lista e metadados visuais, com limites seguros. Testar navegação até os extremos e retorno após trocas.

- [x] **5. Implementar reprodução automática.** Conectar início, pausa, retomada e temporizador às etapas. Garantir que a navegação manual pause a reprodução e que temporizadores sejam cancelados ao sair da feature. Testar com tempo controlado.

- [ ] **6. Implementar conclusão e reinício.** Ao chegar à última etapa, finalizar a reprodução e disponibilizar Restart. Reiniciar restaura a lista original e começa novamente; listas com menos de dois valores não podem iniciar. Testar esses fluxos e seus limites.

- [ ] **7. Conectar os controles persistentes.** Ligar o footer do layout ao estado e às ações da simulação, mantendo os componentes de controle apresentacionais. Exibir Start, Pause ou Restart conforme o estado e desabilitar ações indisponíveis. Testar as interações do footer.

- [ ] **8. Proteger edição durante a simulação.** Desabilitar adição, edição e exclusão enquanto estiver reproduzindo ou pausado. Após a conclusão, permitir alterações e preparar uma nova simulação sem histórico obsoleto. Testar também menus ou edições já abertos no início da reprodução.

- [ ] **9. Destacar comparações e valores ordenados.** Adicionar ao design system tokens amarelos e verdes para ambos os temas. Aplicar os estados aos quadrados, com informação acessível além da cor e contraste adequado. Testar os estados renderizados em cada etapa.

- [ ] **10. Animar as trocas.** Mostrar a troca como etapa própria e animar o deslocamento mantendo a identidade dos itens, inclusive com valores repetidos e em telas menores. Respeitar `prefers-reduced-motion` e preservar o estado correto ao pausar ou navegar.

- [ ] **11. Validar o fluxo completo.** Verificar manualmente reprodução, pausa, avanço, retorno, conclusão, reinício e edição nos dois temas e em telas menores. Executar `npm test` e `npm run build`; corrigir regressões e atualizar a documentação da feature conforme a implementação final.
