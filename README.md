# The Office — Sorteio de Episódios

Sorteador de episódios de *The Office* em estilo máquina de caça-níqueis. Escolhe um
episódio aleatório a partir de um filtro (todos, por temporada, ou por personagem
principal) e mostra o resultado com título, data e sinopse.

Os nomes internos de pastas/pacotes (`the-office-roulette`, `SlotMachine`, etc.)
ficaram como estão — só o nome exibido para quem usa o app mudou.

Dados consumidos de [theofficeapi.dev](https://theofficeapi.dev/).

## Estrutura

```
server/   API Express que faz proxy/cache dos dados de theofficeapi.dev
client/   Front-end em React (Vite)
```

### Por que um backend?

A API pública pagina episódios/personagens (19 e 9 páginas respectivamente) e não
expõe nativamente filtros por temporada/personagem nem relação episódio↔personagem.
O servidor Node agrega tudo uma vez, mantém em cache (12h) e expõe endpoints já
filtrados para o front consumir:

- `GET /api/seasons`
- `GET /api/characters/main` — lista curada de personagens principais (a API não
  marca quem é "main cast", então essa lista é mantida à mão em
  `server/src/mainCharacters.js`)
- `GET /api/episodes` — todos os episódios
- `GET /api/episodes?season=<id>` — episódios de uma temporada
- `GET /api/episodes?characterId=<id>` — aproximação dos episódios "do" personagem

**Limitação conhecida:** a API não informa o elenco de cada episódio, só a primeira
e a última aparição de cada personagem. O filtro por personagem usa esse intervalo
(`firstAppearance` → `lastAppearance`) como aproximação, não a lista exata de
episódios em que ele aparece.

## Rodando localmente

```bash
npm install          # instala client + server (workspaces)
npm run dev           # sobe server (porta 3001) e client (porta 5173) juntos
```

Acesse http://localhost:5173. O Vite já faz proxy de `/api` para o backend em dev.

Scripts individuais, se preferir:

```bash
npm run dev:server
npm run dev:client
```

## Próximos passos (ideias)

- Persistir/compartilhar o resultado sorteado (link, histórico)
- Evitar repetir o mesmo episódio em sorteios consecutivos
- Trocar a lista estática de personagens principais por algo mais dinâmico, se a
  API vier a expor essa informação
