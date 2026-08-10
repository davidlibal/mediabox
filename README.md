# MediaBox

Central pessoal para baixar conteúdo (Instagram, YouTube) e converter arquivos. Construído com arquitetura modular pensada para evoluir de uso pessoal a produto.

**Status atual: Fase 5 — Provider YouTube real.** Análise de vídeos do YouTube já busca dados reais (título, duração, formatos). Download, conversão e o provider do Instagram ainda são mock.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (design tokens via `@theme` em `app/globals.css`)
- `@distube/ytdl-core` para extração de metadados reais do YouTube
- Deploy: Vercel · Domínio/DNS futuro: Cloudflare · Dados futuros: Supabase

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servir build de produção
npm run lint     # eslint
```

## Estrutura

```
app/
  page.tsx              → Home (hero + análise de URL)
  converter/page.tsx    → Conversor (upload + conversão mock)
  api/health/route.ts   → GET /api/health
  api/analyze/route.ts  → POST /api/analyze (resolve provider e analisa a URL)
  api/download/route.ts → POST /api/download (mock)
  api/convert/route.ts  → POST /api/convert (mock)
  globals.css           → Design tokens (cores, superfícies, animações)
  icon.svg              → Favicon / símbolo do app
components/
  header.tsx, footer.tsx, logo.tsx, status-dot.tsx
  url-analyzer.tsx      → Fluxo de análise/resultado (chama /api/analyze e /api/download)
  converter-flow.tsx    → Fluxo de conversão (chama /api/convert)
  ui/                    → Button, Badge
  icons/                 → Glifos de plataforma e de arquivo
lib/
  providers/
    types.ts            → Contrato Provider/ProviderMeta
    youtube.ts           → Provider YouTube (real, via @distube/ytdl-core)
    instagram.ts         → Provider Instagram (mock)
    registry.ts           → Resolve provider a partir da URL
  platform.ts            → Detecção de plataforma
  conversion.ts           → Categorias de arquivo para o conversor
  cn.ts                   → Utilitário de classes
```

## O que está pronto

- Identidade visual (paleta, tipografia, tokens, logo/símbolo, favicon)
- Header, footer (com a assinatura "Desenvolvido por David Liborio"), home
- Provider Registry com resolução de plataforma por URL
- Fluxo de download: colar link → `/api/analyze` (YouTube real, Instagram mock) → escolher formato → `/api/download` (mock) → resultado
- Fluxo de conversão: soltar arquivo → escolher formato → `/api/convert` (mock) → resultado
- Responsivo (mobile/tablet/desktop), microinterações, `prefers-reduced-motion` respeitado
- `GET /api/health` para checagem básica de status

## O que falta (próximas fases)

Provider real do Instagram, integração Convertio para conversão real, download real de arquivo, Supabase (histórico/settings), rate limiting e proteção SSRF, testes automatizados. Ver o prompt mestre do projeto para o roadmap completo (Fases 6–14).

## Variáveis de ambiente

Veja `.env.example`. Nenhuma é necessária para rodar as fases atuais — a extração de metadados do YouTube não depende de chave de API.

---

Desenvolvido por David Liborio
