<hr>
<h1 align="center">flem-ppe-frontend</h1>
<p align=center><i align="center">Aplicação Frontend para o Projeto Primeiro Emprego, da FLEM</i></p>
<hr>

<div align="center">

<a href="">![Known Vulnerabilities](https://snyk.io/test/github/frtechdev/flem-ppe-frontend/badge.svg)</a>
<a href="">![Code Size](https://img.shields.io/github/languages/code-size/frtechdev/flem-ppe-frontend)</a>
<a href="">![Repo Size](https://img.shields.io/github/repo-size/frtechdev/flem-ppe-frontend)</a>
<a href="">[![Contributors](https://img.shields.io/github/contributors/frtechdev/flem-ppe-frontend)](https://github.com/frtechdev/flem-ppe-frontend/graphs/contributors)</a><br>
<a href="">![Last Commit](https://img.shields.io/github/last-commit/frtechdev/flem-ppe-frontend)</a>
<a href="">[![Fork](https://img.shields.io/github/forks/frtechdev/flem-ppe-frontend)](https://github.com/frtechdev/flem-ppe-frontend/fork) </a>
<a href="">![Version](https://img.shields.io/badge/version-1.0.0-005bff) </a>
<a href="">[![license](https://img.shields.io/github/license/frtechdev/flem-ppe-frontend)](https://github.com/frtechdev/flem-ppe-frontend/LICENSE)</a>

<br>

</div>

Essa aplicação tem como função servir de Frontend para o Portal Primeiro Emprego, um novo conceito de sistema que integra funcionalidades, hoje separadas, de um dos serviços essenciais do cliente (FLEM).

<br>

## Conteúdo

- [Objetivo](#section-obj)
- [Características](#section-carac)
- [Especificações](#section-specs)
- [Stack](#section-stack)
- [Documentação](#section-docs)
- [Como usar este repositório](#section-como-usar)
- [Notas de versão](#section-changelog)
- [Autores](#section-autores)
- [Contato](#section-contato)
- [Licença](#section-licenca)

<br>
<hr>

<a name="section-obj">

## Objetivo

</a>

- Apresentar uma nova solução informatizada que facilite, dinamize e aumente a produtividade dos sistemas computacionais que giram em torno do Projeto Primeiro Emprego
- Fornecer de maneira segura, confiável e precisa, dados relacionados ao Projeto Primeiro Emprego, seguindo os Princípios Básicos de Desenvolvimento, para garantir a sustentabilidade, manutenibilidade e confiabilidade do Software, melhorando sua performance no geral
- Promover documentação clara e densa o suficiente para discriminar processos e permitir que o Software seja facilmente mantido por qualquer profissional da área de Desenvolvimento

<br>
<hr>

<a name="section-carac">

## Características

</a>

- Os sistemas relacionados ao PPE usarão uma única linguagem centrada, no Frontend e Backend: o Javascript, além do mesmo framework para Banco de Dados e mesma estrutura de arquitetura, seguindo mesmo estilo de codificação e integração, permitindo um ambiente harmônico visualmente e estruturalmente
- Recriação da API de integração com Bancos de Dados não-FLEM (ex., Domínio), de fácil modularização, facilitando a manutenção dessa relação e possibilitando facilmente a adaptação a outros Bancos de Dados
- Estrutura homogênea e documentada, alinhada a fluxos de atualização, modificação e melhorias mais rápidas, eficazes e com menor tempo de espera para cumprimento das demandas
- Layout altamente responsivo, com os princípios modernos da Modelagem UI/UX seguindo o Desenvolvimento “Mobile First” para melhor experiência de usuário
- Sistema implementado por dockerização e modularização, alinhados a sistemas de deploy de tempo real baseado no padrão GIT de Sistemas de Controle de Versão, facilitando a reversão e evolução do Software, com fácil atualização devido ao uso de JavaScript como linguagem base
- Criação de um único dashboard – um portal central – contendo todos os sistemas que dependem e cruzam diretamente com as informações do PPE (como por exemplo, SMB e SIGPE). Preferencialmente, esse design será utilizado em outros portais para outros sistemas no futuro se for necessário, criando um ambiente computacional de fácil assimilação e reduzindo tempo necessário para execução de processos triviais

<br>
<hr>

<a name="section-specs">

## Especificações

</a>

- **Tipo de Software:** Aplicação Frontend
- **Distribuição:** Web
- **Arquitetura:** MVC
- **Metodologia de Projeto:** Metodologia Ágil
- **Estrutura de Biblioteca:** Baseada em Framework
- **Disponibilidade de Código:** Open Source

<br>
<hr>

<a name="section-stack">

## Stack

</a>

- **Linguagem Principal:** [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- **Linguagens de Marcação e Estilo:** [HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML), [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS), [SASS](https://sass-lang.com/documentation)
- **Framework Principal:** [Node.js](https://nodejs.org/en/docs/)
- **Framework estrutural:** [Next.js](https://nextjs.org/docs/getting-started)
- **Framework de design:** [Chakra UI](https://chakra-ui.com/docs/getting-started)
- **Gerenciador de Bibliotecas:** [Yarn](https://yarnpkg.com/getting-started)
- **Bibliotecas:** Para uma lista completa de bibliotecas e dependências nos mais variados escopos, conferir o arquivo [package.json](https://github.com/frtechdev/flem-ppe-frontend/blob/main/package.json).

<br>
<hr>

<a name="section-docs">

## Documentação

</a>

- [Roadmap (Módulo SIGPE)](https://miro.com/app/board/uXjVPWCiaDo=/?share_link_id=713196550342)

- [Roadmap (Módulo SMB)](https://miro.com/app/board/uXjVOMzAe7s=/?invite_link_id=872842801580)

- [Modelo Conceitual de Fluxo de Cadastramento de Beneficiários](https://miro.com/app/board/uXjVONgTB50=/?invite_link_id=986301656145)

- [Diagrama de Macroprocessos](https://miro.com/app/board/uXjVOOJxdWc=/?invite_link_id=184583999527)

- [Mapa de Macroprocessos](https://miro.com/app/board/uXjVOOroXvA=/?invite_link_id=576187018086)

- [Manual do Usuário](https://frtechdev.github.io/flem-ppe-backend/resources/portalppe_manual_do_usuario.pdf)

- [Manual de Testes](https://frtechdev.github.io/flem-ppe-backend/resources/portalppe_manual_de_testes.pdf)

- [Checklist de Validação de Testes](https://frtechdev.github.io/flem-ppe-backend/resources/portalppe_checklist_de_validacao.xlsx)

Documentação adicional pode ser encontrada [aqui](https://frtechdev.github.io/flem-ppe-frontend/).

Para documentação pertinente a outros elementos da arquitetura não mencionados neste documento, acesse a documentação Backend clicando [aqui](https://frtechdev.github.io/flem-ppe-backend/).

<br>
<hr>

<a name="section-como-usar">

## Como usar este repositório

</a>

<a name="section-use-project">

### Como Projeto

</a>

1 - Faça um git clone ou o download do repositório, da forma que preferir

`git clone https://github.com/frtechdev/flem-ppe-frontend.git`

2 - Instale um gerenciador de pacotes (preferencialmente yarn) utilizando um terminal no diretório raiz do repositório clonado

`yarn` ou `npm install`

3 - Execute a aplicação no terminal

`yarn dev` ou `npm run dev`

<a name="section-use-app">

### Como Aplicação

</a>

1 - Instale uma instância docker em uma máquina dedicada, conforme instruções na [Documentação do Docker](https://docs.docker.com/engine/install/).

2 - Faça um git clone ou o download do repositório, da forma que preferir

`git clone https://github.com/frtechdev/flem-ppe-frontend.git`

3 - Execute o Dockerfile no diretório raiz do repositório clonado

`docker build . -t flem-ppe-frontend:dev`

4 - Inicie o container

`docker run -d -p XXXX:3000 --name flem-ppe-frontend:dev`

Altere o "XXXX" para uma porta externa de sua escolha. Por padrão, a porta interna é 3000.
Para alterar a porta interna, altere a linha `ENV PORT` do [Dockerfile](https://github.com/frtechdev/flem-ppe-frontend/blob/main/Dockerfile).

<a name="section-vars">

### Variáveis de Ambiente

</a>

Para usar a aplicação, crie um arquivo .env com as seguintes variáveis de ambiente:

| Variável      | Uso   |
|---------------|-------|
|`DATABASE_URL` | Define o endereço do Servidor de BD e credenciais para acesso, de acordo com as especificações da biblioteca [Prisma.io](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-node-sqlserver)| |
|`QUERY_BATCH_SIZE` | Define a capacidade máxima de lotes de processo de query, a fim de dar override no limite que uma query pode se dividir (padrão: 2000) | |
|`NEXT_PUBLIC_APP_SOURCE` | Nome da aplicação. Necessário para indexar os arquivos na API de Upload de Arquivo (padrão: "Portal_PPE") | |
|`NEXT_PUBLIC_API_PPE_BACKEND` | Define o endereço da API Backend do Portal PPE | |
|`NEXT_PUBLIC_API_PPE_BD_LEGADO` | Define o endereço da API de acesso ao BD Legado | |
|`NEXT_PUBLIC_API_FILE_UPLOAD` | Define o endereço da API de Armazenamento de Arquivos  | |
|`NEXT_PUBLIC_API_MAIL_SENDER` | Define o endereço da API de Email  | |
|`NEXT_GOOGLE_API_MAPS_KEY` | Define a chave de API para utilizar os recursos da API do Google Maps. Mais informações podem ser encontradas [aqui](https://developers.google.com/maps/documentation/distance-matrix/get-api-key)  | |
|`NEXT_PUBLIC_LDAP_URI` | Define o endereço do servidor de Domínio do AD para autenticação da API de login via AD  | |
|`NEXT_PUBLIC_LDAP_BASE_DN` | Define um ponto de busca pelas credenciais dentro da organização ou OU  | |
|`NEXT_PUBLIC_LDAP_USERNAME` | Define o nome de usuário da autenticação  | |
|`NEXT_PUBLIC_LDAP_PASSWORD` | Define a senha da autenticação | |

<br>

<hr>

<a name="section-changelog">

## Notas de versão

</a>

<br>

### v1.0.0-221208

- Atualização da Documentação;
- Update do NextAuth para resolução de segurança;

<br>

### v0.0.34-221208

- Remoção do CHANGELOG e inclusão das suas informações no README
- Atualização do prisma schema;
- Atualização da documentação;
- Reorganização dos serviços de API e centralização com um arquivo index;
- Remoção de componentes de teste dentro da estrutura do projeto;
- Transcrição das rotas de API Backend para uma função de aquisição dinâmica de rota;
- Remoção de utilitário duplicado;

<br>

### v0.0.33-220916

- Efetuadas as seguintes alterações na tela do Beneficiário:
  - Modificado o campo “Eixo de Formação” na aba Formação, para que seja preenchido automaticamente ao selecionar a formação;
  - Adicionado campo de observação ao lado dos campos de e-mail e telefone, na aba “Dados”, para que possa ser acrescentado uma observação a cada número ou e-mail adicionado;
- Efetuada alteração na rota de API que atende a página do Beneficiário, para armazenar o campo de observação dos contatos;
- Efetuada atualização do componente FormBox: adicionado prop “onChange”, para executar ação ao alterar o valor do campo;
- Atualizado o prisma.schema: adicionado a coluna observação na tabela Ba_Contatos_Beneficiarios;

<br>

### v0.0.32-220915

- Corrigido rota de API de importação de beneficiários para criar um beneficiário, ou atualizar caso o mesmo já exista no banco (alterado método create para upsert);

<br>

### v0.0.31-220915

- Implementado filtro avançado na tela geral de beneficiários;

<br>

### v0.0.30-220915

- Efetuada tratativa de exceção ao tentar criar um tipo de histórico que já existe;

<br>

### v0.0.29-221028

- Alterações no template jsdoc para direcionamento da documentação
- Criação do arquivo de esquema dbml do banco de dados
- Atualização dos modelos de esquema do prisma
- Atualização da documentação
- Modificação das rotas backend para definir dinamicamente a rota baseada
em variáveis de ambiente
- Transferência das rotas API para o backend de forma dinâmica
- Alteração no serviço de autenticação QA/DEV
- Criação de template para a lista de autenticações

<br>

### 0.0.29-220915

- Efetuada alteração do texto “Editar Ação” para “Detalhes da Ação” no overlay da página Fila de Ações CR;
- Efetuada correção das funções de formSubmit das páginas Envio de Ofícios e Envio de Comunicados, onde ao clicar em salvar, a barra de progresso de upload mostra 100%, o overlay não fecha e precisa atualizar a página;
- Efetuadas correções na tela de Eventos:
  - opção excluir evento não funcionava;
  - ao marcar Criar Ação na CR, não associava o colaborador da CR e apresentava erro;
- Efetuadas correções na tela de Beneficiários:
  - município não é salvo ao alterar na aba vaga;
  - alterado label Demandante SEC para Demandante na aba vaga;
  - implementado número de linhas na lista geral de beneficiários;
- Efetuada correção na página Escritório Regional: desabilitado o campo de monitores, o mesmo será reabilitado na implantação do módulo de monitoramento (SMB);
- Efetuada correção na página Formação: alterado o texto do modal de confirmação de exclusão;
- Efetuada correção na página Unidade de lotação: alterado o texto do overlay “Editar Unidade” para “Editar Unidade de Lotação”;
- Efetuada alteração do título na página de Login;
- Efetuada criação da tabela Editor_Parametros e criado seed para alimentar a tabela;
- Efetuadas correções no componente de editor de textos na página de Ofícios, onde não era carregado/exibia as informações;
- Efetuadas correções na página Envio de Ofício:
  - Substituído texto “Email Remetente” para “Remetente de Email” no overlay de criação de ofício;
  - Alterado o texto “Adicionar Ofício” para “Adicionar Envio de Ofício” do overlay de criação de ofício;
- Adicionada a dependência "node-quill-converter" para conversão de delta em HTML;
- Criada rota de API para alimentar os parâmetros nos editores de texto e e-mail;
- Efetuada correção na query do beneficiariosController, onde apresentava erro quando CPF ou Matrícula eram nulos;
- Efetuada atualização no componente Table: incluído prop para atualizar estado da contagem de linhas;
- Efetuada atualização nos componentes EmailEditor e TextEditor: incluído prop para receber os parâmetros que serão substitídos;

<br>

### v0.0.28-220911

Merge Commit

- v0.0.18-220728rl
- v0.0.19-220728rl
- v0.0.20-220802rl
- v0.0.21-220805rl
- v0.0.22-220815rl
- v0.0.23-220818rl
- v0.0.24-220905
- v0.0.25-220908
- v0.0.26-220909
- v0.0.27-220909

<br>

### v0.0.27-220909

- Renomeada tabela Ba_Remessa_Setre na rota de importação de beneficiários;
- Alterado o container registry para build e push da imagem docker;

<br>

### v0.0.26-220909

- Renomeada tabela Ba_Remessa_Setre para Ba_Remessa_Sec e atualizadas as relações;
- Removido a constraint unique da coluna historicoId, da tabela Ba_Lista_Presenca;

<br>

### v0.0.25-220908

- Atualização da página de signin;
- Implementação de controlar para autenticação com usuários QA em arquivo interno;
- Atualização do componente Logo: corrigido problema de renderização do SVG em navegadores específicos (“Safari e Mozilla Firefox”);
- Remoção de dependência não utilizada: little-state-machine;
- Ajuste no timeout nos clients de requisição HTTP;
- Ativação da propriedade .auth em todas as páginas, para checagem da autenticação;
- Criação de regra para ignorar autenticação em ambiente DEV (local);
- Atualização do componente Navbar para informar o nome do usuário logado;
- Modificações realizadas para deploy em contêiner Docker:
  - Criado arquivo Dockerfile;
  - Inserção do parâmetro output no arquivo next.config;
  - Inserção do parâmetro binaryTargets no arquivo prisma.schema;
  - Inserção do parâmetro executablePath, na inicialização do browser na rota de API reports;

<br>

### v0.0.24-220905

- Criação de variável de ambiente para direcionamento de API de arquivo;
- Criação de variável de ambiente para identificação da origem de requisição de API de arquivo;
- Criação de variável de ambiente para apontar o BD legado na camada de teste;
- Criação de variável de ambiente contendo a chave API do Google para consulta da distância entre cidades;
- Regras de linting criadas para suprimir falsos positivos na validação dos web hooks no nível de dependência exaustiva do react (react-exaustive-deps);
- Adicionado comando de seeding de entidades de Banco de Dados via package.json;
- Adicionado plugin de controle para revisão segura do uso de hooks não-exaustivos;
- Atualização de dependências;
- Alteração de modelos e estruturas de Banco de Dados;
- Criação dos seeds de injeção de entidades aos modelos:
  - Etnias (raça, cor e denominação étnica);
  - Tamanhos de Uniforme;
  - Formações e Eixos de Formação;
  - Pendências e tipos de Pendências;
  - Tipos de Histórico;
  - Demandantes;
  - Municípios e Territórios de Identidade;
  - Situações de Vaga;
- Transferência de padding como prop no componente AnimatePresenceWrapper;
- Alteração das rotas de gerenciamento de ações CR para buscar dentro do Banco de Dados;
- Atualização dos componentes:
  - Cards Visuais;
  - Dropzone para área de upload;
  - Input Box geral;
  - Input Box com máscara;
  - Layout do Dashboard;
  - Input de Célula para tabelas;
  - Navbar;
  - Input de Célula para múltipla seleção;
  - Table;
  - TextEditor;
  - TextViewer;
  - Dados de Sidebar;
  - Componente de Importação de Beneficiário;
  - Componente de Visualização do Beneficiário;
  - Comunicados;
  - Dashboard;
  - Envio de Ofícios;
  - Exibição de Escritórios Regionais;
  - Exibição de Eventos;
  - Fila de Ações;
  - Situações de Vaga;
  - Templates de Ofícios;
- Atualização dos objetos de rota API:
  - Ações realizados à CR;
  - Beneficiários;
  - Envios de Comunicados;
  - Painel de Comunicados;
  - Escritórios Regionais;
  - Demandantes;
  - Eventos;
  - Lista de Presença de Eventos;
  - Eixos;
  - Materiais;
  - Municípios;
  - Anexos de Ofícios;
  - Gerenciamento de Eventos;
  - Situações de Vaga;
- Atualização dos serviços:
  - APIService;
  - prismaClient;
- Criação dos serviços apiAllowCors para override da restrição do CORS;
- Adição dos utilitários de máscaras;
- Exclusão das rotas API:
  - funcionários (acesso ao sistema legado);
  - funcionários RH (acesso ao sistema legado);
- Criação dos componentes:
  - Caixa de Formulário;
  - Construtor de Formulário;
  - Switch de formulário;
  - Formulário customizado;
  - Página de visualização de beneficiários;
  - Página de criação de tipos de histórico;
  - Página de criação de Unidade de Lotação;
- Criação dos controllers:
  - Requisição de beneficiarios;
- Criação das rotas API:
  - Beneficiários por ID;
  - Validação de planilhas;
  - Validar pendências do upload de planilha;
  - Importar beneficiários;
  - Cálculo de distância;
  - Colaboradores da CR;
  - Etnias;
  - Beneficiários;
  - Tamanho de Uniforme;
  - Unidades de Lotação;
  - Tipo de Histórico;
  - Ponto Focal e Unidades de Lotação;

<br>

### v0.0.23-220818rl

- Atualização do prisma schema para criação da tabela de Lista de Presença dos Beneficiários nos Eventos, e associação da mesma com as tabelas Beneficiários e Eventos;
- Atualização do componente MenuIconButton: atribuído rest das props no botão;
- Atualização da página Eventos: Incluído modais para gerar e baixar a lista de presença, e para informar presença dos beneficiários nos eventos;
- Criação da página lista-presença: página para renderização de dados para gerar lista de presença dos beneficiários nos eventos;
- Atualização da rota eventos: inclusão de gel evento via id para atender a página de lista de presença;
- Criação da rota de API reports: rota para geração de reports em PDF, estilizados com CSS e renderizados no React via Puppeteer;
- Criação da rota de API eventos/presenca: rota necessária para atender a função Informar Presença na página Eventos;
- Atualização do pagePrint.css: realizado adequações para adequar a renderização no formato A4 para a geração de relatórios em PDF;

<br>

### v0.0.22-220815rl

- Atualização do prisma schema para criação da tabela de Uploads de arquivos, e inclusão da coluna anexosId nas tabelas de comunicados e ofícios;
- Atualização do componente Dropzone: efetuado refatoração para trabalhar com react-hook-form, e adicionado botão para download de arquivos já anexados;
- Atualização das páginas Comunicados e Envio-Ofícios: adição do campo para anexar arquivos;
- Criação das rotas de API para atender o upload de arquivos nas páginas envio-ofícios e comunicados;
- Refatoração das rotas de API “Ofícios/Gerenciar” e “Comunicados” para atender o upload de arquivos;

<br>

### v0.0.21-220805rl

- Atualização do prisma schema para criação das tabelas de Ofícios e Ofícios Enviados;
- Atualização do componente TagInput: incluído hook useEffect para atualização do input caso sejam carregados valores na prop defaultValues;
- Atualização do componente SidebarData, para alterar o link da página de Ofícios para Template-Ofícios;
- Refatoração da página ‘Ofícios’ para ‘Templates-Oficios’;
- Remoção da página parâmetros de ofícios;
- Refatoração da página ‘templates’ para ‘index’ em temlpates-oficios;
- Refatoração da página ‘Comunicados’: alteração da função onSubmitDemandante para onSubmitComunicado;
- Atualização do componente SelectInputBox: incluído a prop ‘inputRightElement’, para mostrar um botão de ícone dentro do input recebido pela própria prop;
- Atualização do componente TagInput: incluído hook useEffect para carregar o defaultValues no input do formulário;
- Criação do componente TextViewer: componente para renderizar os Deltas criados no componente TextEditor, somente como visualização.
- Criação do hook customizado ‘useCustomForm’: hook contendo as principais funções a serem utilizadas em um formulário dentro de um drawer (overlay);
- Finalização da página envio-ofícios;
- Criação das rotas de API para atender a página envio-ofícios;

<br>

### v0.0.20-220728rl

- Criação das tabelas Comunicados, Comunicados_Remetentes e Comunicados_Envios, bem como suas relações no schema.prisma, e adicionando relacionamento m:n com a tabela de beneficiários;
- Atualização do componente EmailEditor: alteração do padding no contêiner para padronização de acordo com os demais imputs;
- Atualização do componente SidebarData, para incluir o link da página de Comunicados;
- Criação da página ‘Comunicados’, para envios de comunicados por e-mail para os beneficiários;
- Criação das rotas de API para a página ‘Comunicados’: Comunicados, Envios e Remetentes;

<br>

### v0.0.19-220728rl

- Atualização da tabela Monitores no schema.prisma, adicionando relacionamento m:n com a tabela de escritórios regionais;
- Refatoração da página ‘Monitores’, afim de direcionar o submit do formulário para a rota de API, criação da lógica para associar monitores aos escritórios regionais e inclusão da caixa de diálogo para excluir monitor;
- Criação da rota de API para a página ‘Monitores’;
- Criação da rota de API Funcionarios/RH para consumir dados dos funcionários do banco da Domínio Sistemas (RH);

<br>

### v0.0.18-220728rl

- Criação da tabela Materiais no schema.prisma, com relacionamento m:n com a tabela de beneficiários;
- Atualização do componente InputTextBox: alterado o componente Input para Textarea, e definido quantidade de linhas para 6;
- Refatoração da página 'Materiais', afim de direcionar o submit do formulário para a rota de API e inclusão da caixa de diálogo para excluir material;
- Criação da rota de API para a página 'Materiais';

<br>

### v0.0.18-220727

- v0.0.17-220727dx

<br>

### v0.0.17-220727dx

- Alteração da rota de dashboard para corrigir erro de rota
- Adição de regras de linting
- Adição de dados de licença no package.json e especificação de porta
- Atualização do README

<br>

### v0.0.17-220726rl

- Criação do esquema no prisma client para implementação das rotas de API;
- Criação das rotas de API:
  - Ações CR;
  - Beneficiários;
  - Escritórios regionais;
  - Eventos;
  - Fila de Ações da CR;
  - Formações;
  - Funcionários;
  - Municípios;
  - Templates de ofícios;
  - Situações de Vaga;
- Criação dos componentes:
  - Botão do Switch;
  - Editor de corpo de Email;
  - Input tipo Checkbox;
  - Editor de texto/template;
  - Input tipo Select;
  - Input tipo Tag para CPFs/Matrículas em lote (separando por vírgula);
  - Botão Menu com Ícone;
  - Função de renderização dos dados do Breadcrumb;
- Criação das páginas:
  - Ações CR;
  - Demandantes;
  - Eventos;
  - Fila de Ações da CR;
  - Formações;
  - Monitores;
  - Templates de Ofícios;
  - Situações de Vaga;
- Finalização das páginas:
  - Importar beneficiários;
  - Materiais;
- Atualização das props do form control nos componentes:
  - Input tipo Currency (monetário);
  - Input tipo texto;
  - Input tipo Text Box;
  - Input tipo texto com suporte a máscaras;
  - Input tipo Password com visualização do campo ;
  - Select Input Box;
- Atualização dos SVGs dos logos;
- Criação dos estilos CSS para editor de texto/corpo de email;
- Inclusão de funções utilitárias (capitalização e ordenar array de objetos por propriedade especificada);

<br>

### v0.0.16-220603

- Atualização do CHANGELOG
- Modificações semânticas no README
- Merge para Feature e Release

<br>

### v0.0.15-220603rl

- Criação dos componentes: Dropzone Upload, Inputs de Tabela (Cell Inputs),
- Criação das páginas: beneficiários/importar beneficiários, materiais e ofícios;
- Refatoração dos componentes de Sidebar;
- Adição de tema do componente Modal;
- Criação da rota de upload de arquivos;
- Criação da API para parser da planilha de importação de beneficiários;
- Criação de ferramenta para correção dos números de telefone (nono dígito para telefones celulares)

<br>

### v0.0.14-220603dx

- Adição das documentações recentes nos componentes.

<br>

### v0.0.13-220331dx

- v0.0.13-220331dx

<br>

### v0.0.12-220322fr

- v0.0.11-220322rl

<br>

### v0.0.11-220322rl

- Criação dos componentes: Tabela com filtro, Overlay, Toast, Card, Line Chart, Textarea;
- Criação das páginas beneficiários e materiais;
- Criação dos temas de componentes;

<br>

### v0.0.10-220224fr

- v0.0.9-220224fr

<br>

### v0.0.9-220224fr

- Teste de commit do branch
- Atualização do changelog

<br>

### v0.0.8-220224dx

- Teste de commit do branch
- Atualização do changelog

<br>

### v0.0.7-220224fr

- v0.0.4-220224dx
  - Início da implementação do redirect de documentação
  - Atualização do README.md
  - Criação do CHANGELOG.md

<br>

### v0.0.6-220224fr

- v0.0.5-220224dx
  - Alteração no diretório de destino do jsdoc

<br>

### v0.0.5-220224dx

- Alteração no diretório de destino do jsdoc

<br>

### v0.0.4-220224dx

- Início da implementação do redirect de documentação
- Atualização do README.md
- Criação do CHANGELOG.md

<br>

### v0.0.3-220221fr

- v0.0.220221fr

<br>

### v0.0.2-220221fr

- v0.0.1-220221rl
  - Criação do layout inicial do Frontend;
  - Configuração inicial e layout da documentação;
  - Criação dos componentes da Sidebar, Navbar, Breadcrumb e Inputs;
  - Criação do layout do dashboard;
  - Criação do componente de seletor de entidades;
  - Criação da página de login;
  - Implantação do LDAP Service para autenticação;
  - Configuração inicial do Next Auth para autenticação via LDAP;
  - Redirecionamento de rotas para a página principal;
  - Desenvolvimento inicial do tema de cores baseada na cor base do logo do cliente;

<br>

### v0.0.1-220221rl

- Criação do layout inicial do Frontend;
- Configuração inicial e layout da documentação;
- Criação dos componentes da Sidebar, Navbar, Breadcrumb e Inputs;
- Criação do layout do dashboard;
- Criação do componente de seletor de entidades;
- Criação da página de login;
- Implantação do LDAP Service para autenticação;
- Configuração inicial do Next Auth para autenticação via LDAP;
- Redirecionamento de rotas para a página principal;
- Desenvolvimento inicial do tema de cores baseada na cor base do logo do cliente;

<br>
<hr>

<a name="section-autores">

## Autores

</a>

<a href="https://github.com/frtechdev/flem-ppe-frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=frtechdev/flem-ppe-frontend" />
</a>

<br>
<hr>

<a name="section-contato">

## Contato

</a>

Se você gostou desse projeto, nos dê uma <a href="https://github.com/frtechdev/flem-ppe-frontend" data-icon="octicon-star" aria-label="Star frtechdev/flem-ppe-frontend on GitHub">estrela</a>. Isso agirá como um indicador da qualidade dos nossos serviços. <br>
Para contato, envie um email a: <a href="mailto:devops@frtechnologies.com.br">devops@frtechnologies.com.br</a>

<br>
<hr>

<a name="section-licenca">

## Licença

</a>

Licenciado sob a [MIT License](https://github.com/frtechdev/flem-ppe-frontend/blob/main/LICENSE).
