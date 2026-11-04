# Sorting

Feature de visualização interativa dos algoritmos de ordenação. Antes de criar ou alterar código nesta feature, consulte este documento para preservar as fronteiras de responsabilidade descritas abaixo.

## Estrutura

- `pages/`: composição das rotas e renderização do estado da simulação. Páginas não implementam lógica de ordenação nem gerenciam diretamente a lista.
- `components/`: componentes de apresentação e interação. Eles emitem intenções do usuário, sem conter regra de domínio.
- `services/`: estado compartilhado da lista, lógica dos algoritmos e controle da reprodução das etapas.
- `state/`: tipos e estruturas de estado compartilhadas pela simulação, quando necessários.

## Arquitetura da lista e dos algoritmos

`SortingListService` é a fonte única de verdade para a lista atualmente exibida. Ele é responsável por inicializar e expor os valores, além de oferecer operações genéricas sobre eles, como adicionar, substituir, trocar e restaurar valores.

Cada algoritmo tem seu próprio service, por exemplo `BubbleSortService`, `SelectionSortService` ou `InsertionSortService`. Esses services concentram exclusivamente as regras do método: comparações, decisão de troca, geração de etapas e controle da execução. Um algoritmo nunca deve modificar o array diretamente; ele calcula o próximo estado e o aplica por meio do `SortingListService`.

Essa separação permite que qualquer alteração ordenada seja refletida automaticamente na interface por meio do sinal `sortingList.values()` e evita duplicidade de estado entre página, algoritmo e componentes.

```text
BubbleSortPage / componentes
          │ intenção do usuário
          ▼
BubbleSortService
          │ calcula a próxima etapa
          ▼
SortingListService
          │ sinal da lista atual
          ▼
interface
```

## Etapas e histórico

Os métodos precisam suportar pausar, avançar e voltar sem perder o estado visual. Os contratos em `state/sorting-simulation.ts` definem snapshots imutáveis com itens e IDs, índices comparados, posições definitivas e indicação de troca. Os índices referem-se às posições no snapshot da própria etapa; IDs distinguem itens com valores iguais.

O histórico vazio usa índice atual `-1`; quando há etapas, o índice vai de `0` até `steps.length - 1`, inclusive. A reprodução pode estar em `idle`, `playing`, `paused` ou `completed`.

`BubbleSortService.generateSteps` gera o snapshot inicial, uma etapa para cada comparação, outra para cada troca e etapas para marcar posições definitivas. A entrada não é alterada; itens com valores iguais mantêm seus IDs e sua ordem relativa. Uma lista vazia gera somente o snapshot inicial; uma lista com um item também gera a marcação de sua posição definitiva.

Ao avançar, o service seleciona ou gera o próximo `SortingStep` e atualiza o `SortingListService` com `step.items`. Ao voltar, restaura o snapshot anterior. Informações visuais, como os índices em comparação ou uma troca realizada, pertencem à etapa do algoritmo — não à página.

`SortingListService.applySnapshot` aplica e restaura itens na ordem recebida, preservando seus IDs e copiando os dados. Novos itens continuam recebendo IDs distintos, inclusive depois de restaurar um snapshot anterior.

`BubbleSortSimulationService.prepare()` cria um histórico a partir da lista exibida. `next()` e `previous()` selecionam etapas dentro dos limites, aplicando seus itens à lista; `currentStep` expõe os metadados visuais correspondentes. Antes da preparação, a etapa atual é nula e a navegação não altera a lista.

`start()` prepara o histórico quando necessário e inicia ou retoma a reprodução a cada segundo; `pause()` interrompe o temporizador. A navegação manual pausa a reprodução, inclusive nos limites. O serviço de simulação e a lista são providos pelo layout de `/sort`, e o temporizador é cancelado quando esse escopo é destruído. Por enquanto, ao alcançar a última etapa, a reprodução fica pausada; conclusão e reinício serão tratados na entrega 6.

## Escopo de estado

Enquanto a simulação precisar compartilhar a mesma lista entre métodos dentro de `/sort`, o `SortingListService` deve ser provido no escopo do layout da rota de ordenação, em vez de globalmente. Assim, o estado persiste durante a navegação entre métodos da feature e é descartado ao sair dela.
