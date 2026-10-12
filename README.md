# The Office — Sorteio de Episódios

Sorteador de episódios de *The Office* em estilo máquina de caça-níqueis. Escolhe um
episódio aleatório a partir de um filtro (todos, por temporada, ou por personagem
principal) e mostra o resultado com título, data e sinopse.

🔗 Publicado em: https://oliveiradaniel.github.io/-the-office-episode-sorter/

## Estrutura

```
client/   Front-end em React (Vite) — é todo o app, 100% estático
scripts/  Script Node único para gerar o snapshot de dados (ver abaixo)
```

### Por que não tem backend?

A série acabou em 2013, então os dados de [theofficeapi.dev](https://theofficeapi.dev/)
(episódios, temporadas, personagens) nunca mudam. Em vez de chamar a API em tempo de
execução, `scripts/fetch-office-data.mjs` busca tudo uma vez e grava como JSON estático
dentro de `client/src/data/` (`episodes.json`, `seasons.json`, `mainCharacters.json`).
O app lê esses arquivos direto, sem rede, sem servidor.

- `mainCharacters.json` já vem com a lista curada de personagens principais (a API
  não marca quem é "main cast", isso é mantido à mão no próprio script) e o intervalo
  de episódios de cada um.
- **Limitação conhecida:** a API não informa o elenco de cada episódio, só a primeira
  e a última aparição de cada personagem. O filtro por personagem usa esse intervalo
  (`firstAppearance` → `lastAppearance`) como aproximação, não a lista exata de
  episódios em que ele aparece.

Se a API corrigir algum dado ou você quiser atualizar o snapshot:

```bash
npm run fetch-data
```

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:5173.

## Publicando no GitHub Pages

O workflow em `.github/workflows/deploy.yml` builda e publica a cada push na `main`,
via GitHub Actions (`actions/deploy-pages`). Só precisa habilitar uma vez, em
**Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

O `base` em `client/vite.config.js` já está configurado para o caminho do projeto
(`/-the-office-episode-sorter/`), já que é uma project page (não é `usuario.github.io`
na raiz).

## Próximos passos (ideias)

- Persistir/compartilhar o resultado sorteado (link, histórico)
- Evitar repetir o mesmo episódio em sorteios consecutivos
- Traduzir título/sinopse para português
