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

Os métodos precisam suportar pausar, avançar e voltar sem perder o estado visual. Para isso, o service do algoritmo deve trabalhar com snapshots imutáveis, preferencialmente por meio de uma estrutura semelhante a:

```ts
interface SortingStep {
  values: number[];
  comparing: [number, number] | null;
  swapped: boolean;
}
```

Ao avançar, o service seleciona ou gera o próximo `SortingStep` e atualiza o `SortingListService` com `step.values`. Ao voltar, restaura o snapshot anterior. Informações visuais, como os índices em comparação ou uma troca realizada, pertencem à etapa do algoritmo — não à página.

## Escopo de estado

Enquanto a simulação precisar compartilhar a mesma lista entre métodos dentro de `/sort`, o `SortingListService` deve ser provido no escopo do layout da rota de ordenação, em vez de globalmente. Assim, o estado persiste durante a navegação entre métodos da feature e é descartado ao sair dela.
