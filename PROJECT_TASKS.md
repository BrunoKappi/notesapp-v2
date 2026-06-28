# Projeto de Refatoração: Bkappi Notes (Estilo Google Keep)

## Visão Geral
O objetivo deste projeto é realizar uma revisão e refatoração completa da aplicação de notas, atuando como um Desenvolvedor Full Stack Senior. A aplicação será atualizada para utilizar tecnologias modernas (React, TypeScript, TailwindCSS, shadcn/ui, Lucide React, TanStack Query, Axios, Firebase) com uma arquitetura baseada em Repository, Service, Hooks e injeção de dependências. O design e experiência de uso serão extremamente semelhantes ao Google Keep, mantendo a identidade visual do Bkappi Notes.

---

## Lista de Tarefas

### 1. Preparação e Configuração Inicial
- 🟩 Configurar TypeScript e TailwindCSS (se não estiver configurado perfeitamente).
- 🟩 Instalar e configurar `shadcn/ui`, `lucide-react`, `@tanstack/react-query`, `axios`, `clsx`, `tailwind-merge`.
- 🟩 Configurar estrutura de pastas (services, repositories, hooks, dtos, components, pages).

### 2. Autenticação (Login)
- 🟩 Refazer a tela de login (design moderno, limpo).
- 🟩 Remover imagens e usar o ícone oficial da aplicação.
- 🟩 Implementar campos de e-mail e senha, botão "Entrar", "Entrar com Google", "Criar Conta", "Esqueci minha senha".
- 🟩 Utilizar componentes shadcn/ui.
- 🟩 Implementar tela de carregamento (Loading Overlay) durante o login.

### 3. Sidebar e Limpeza
- 🟩 Remover a Sidebar atual.
- 🟩 Remover a Tela de Perfil, Configurações e código morto relacionado.

### 4. Navbar
- 🟩 Simplificar Navbar (apenas nome "Bkappi Notes", pesquisa, botão Claro/Escuro, Avatar).
- 🟩 Implementar Popover do Avatar (Nome, Email, Trocar Conta, Ver Notas Arquivadas, Sair).
- 🟩 Remover Pesquisa de satisfação e botão da Sidebar.

### 5. Pesquisa
- 🟩 Desenvolver pesquisa em tempo real por título, conteúdo e etiquetas.
- 🟩 Garantir que a pesquisa seja instantânea e reativa.

### 6. Notas (Visual e Layout)
- 🟩 Revisar espaçamento, sombras, bordas, arredondamento e tipografia semelhantes ao Keep.
- 🟩 Corrigir bugs de CSS (conteúdo invade título, título cortado, sobreposição).
- 🟩 Implementar altura dinâmica para as notas (Masonry layout, possivelmente).

### 7. Drag and Drop
- 🟨 Implementar Drag and Drop para reorganização manual.
- 🟨 Persistir ordem das notas no banco de dados.
- 🟨 Bloquear seleção de texto durante o Drag (permitir seleção apenas no Modal).

### 8. Modal da Nota
- 🟩 Refazer Modal usando shadcn/ui.
- 🟩 Título maior, negrito, em destaque.
- 🟩 Conteúdo com campo invisível (textarea auto-resize), texto livre, quebras de linha.
- 🟩 Rolagem apenas no conteúdo da nota.
- 🟩 Rodapé fixo com ícones: Cores, Etiquetas, Excluir, Arquivar.
- 🟩 Corrigir bug: O Modal nunca deve fechar ao alterar propriedades da nota.

### 9. Cores das Notas
- 🟩 Expandir paleta de cores disponíveis (Popover moderno de seleção).
- 🟩 Implementar pares de cores para Modo Claro e Modo Escuro (contraste adequado) usando variáveis CSS dinâmicas.

### 10. Autosave
- 🟩 Implementar salvamento automático com debounce.
- 🟩 Criar indicador visual fixo no canto inferior direito (Sincronizando, Sincronizado, Erro).
- 🟩 Nunca salvar a cada tecla digitada (apenas após inatividade).

### 11. Criar Nova Nota
- 🟩 Ajustar comportamento do "Criar nota": clicar deve abrir diretamente o Modal vazio, como no Google Keep.

### 12. Etiquetas
- 🟩 Implementar sistema de várias etiquetas por nota.
- 🟩 Adicionar, remover, criar nova e excluir etiquetas via Modal.
- 🟩 Mostrar etiquetas no rodapé das notas (com botão 'X' para remover).
- 🟩 Implementar filtro por etiquetas com chips interativos no topo.

### 13. Arquivamento
- 🟩 Adicionar suporte a arquivamento (campo `archived`).
- 🟩 Exibir botão "Visualizar apenas Arquivadas" no Popover do usuário.
- 🟩 Permitir Arquivar, Desarquivar e Excluir.

### 14. Tema Claro/Escuro
- 🟩 Implementar suporte a temas via Tailwind/shadcn.
- 🟩 Aplicar suporte de temas em todas as áreas da UI.
- 🟩 Paletas de cores diferentes para notas baseadas no tema ativo.

### 15. Limpeza de Imagens
- 🟩 Remover pasta `src/images`.
- 🟩 Substituir qualquer imagem por ícones Lucide/SVG ou remover.

### 16. Banco de Dados e Arquitetura
- 🟩 Refatorar e desacoplar camada de dados.
- 🟩 Criar interface/padrão de `Repository` para comunicação de dados.
- 🟩 Criar camada de `Service` contendo regras de negócio.
- 🟩 Utilizar Custom Hooks com `React Query` e `Axios`.
- 🟩 Manter a implementação atual via Firebase Firestore/Auth mas preparada para troca.

### 17. UX e Validação Final
- 🟩 Assegurar animações discretas e imediatas.
- 🟩 Validação cruzada de performance e fluidez da UI.
- 🟩 Corrigir todos os warnings de ESLint e TS (TypeScript).

---

## Progresso

- (Sessão 1 e 2 - Concluídas) Foram implementadas as principais modernizações de UI usando Tailwind e Shadcn/ui.
- (Sessão 3 - Atual) 
  - Removido `src/images` por completo. Atualizado Login, Registrar, Forget, NotFound.
  - Implementada a arquitetura com `@tanstack/react-query`, `NoteRepository` e `NoteService`.
  - Criado o hook `useUpdateNote` que engatilha o Autosave em background e um componente `SyncIndicator` global.
  - Atualizado Navbar para incluir a filtragem dinâmica de Notas Arquivadas vs Ativas.
  - Corrigido o layout de Login (centralização vertical e horizontal no container `.App`).
  - Importado e corrigido o carregamento do `index.css` no ponto de entrada do Vite (`index.jsx`), habilitando o Tailwind.
  - Desenvolvido o **Sistema Completo de Etiquetas (Tags)**: modal global de marcadores, popovers individuais nas notas e chip filters no topo do grid.
  - Desenvolvido o **suporte completo a Cores adaptadas ao Modo Escuro**: mapeamento dinâmico de cores baseadas em variáveis CSS.
  - Corrigido o layout de Notas Arquivadas (ajustado comportamento do Masonry com `flex: 1` e ocultado o formulário de criação).

---

## Pendências

- 7. Drag and Drop (Requer substituição de `react-masonry-css` ou adaptação avançada).

---

## Melhorias Encontradas

- A persistência no Firebase atualmente tem lógica injetada que interage com Redux (em `Utilidades.js`). Isso foi parcialmente resolvido criando uma camada Repository que pode isolar isso, mas o ideal será num futuro descontinuar Redux para Notes State totalmente, já que agora temos `react-query`.

---

## Arquitetura

- **Repository Pattern:** Foi implementado `NoteRepository` (interface) e `FirebaseNoteRepository`.
- **Services:** `NoteService` orquestra a comunicação.
- **Hooks:** `@tanstack/react-query` gere a mutação de dados em `useUpdateNote` e o fetch in `useNotes`.

---

## Bugs Corrigidos

- Bug do Modal fechando ao editar cores/arquivar nota foi resolvido migrando de `react-bootstrap/Modal` para `shadcn/Dialog` e tratando eventos de clique sem afetar o open state da Dialog nativa.
- Corrigida a sobreposição e falha de foco/digitação do input de busca que ocorria pela falta do processamento de `pointer-events-none` do Tailwind.
- Corrigida a compressão dos cards de notas arquivadas ajustando a propriedade de distribuição flexível nas colunas do Masonry.
- Resolvido o contraste inadequado das cores de notas no modo escuro utilizando mapeamento por variáveis CSS.
