# MediaBox

Central pessoal para baixar conteúdo (Instagram, YouTube) e converter arquivos. Construído com arquitetura modular pensada para evoluir de uso pessoal a produto.

**Status atual: Fase 1 — Design e Fundação.** Interface completa com dados fictícios; nenhuma integração real (download/conversão) foi implementada ainda.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (design tokens via `@theme` em `app/globals.css`)
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
  page.tsx            → Home (hero + análise de URL, mock)
  converter/page.tsx  → Conversor (stub visual — Fase 3)
  api/health/route.ts → GET /api/health
  globals.css         → Design tokens (cores, superfícies, animações)
  icon.svg            → Favicon / símbolo do app
components/
  header.tsx, footer.tsx, logo.tsx, status-dot.tsx
  url-analyzer.tsx    → Fluxo de análise/resultado (mock, sem backend real)
  ui/                 → Button, Badge
  icons/              → Glifos de plataforma
lib/
  platform.ts         → Detecção de plataforma + dados fictícios
  cn.ts               → Utilitário de classes
```

## O que está pronto

- Identidade visual (paleta, tipografia, tokens, logo/símbolo, favicon)
- Header, footer (com a assinatura "Desenvolvido por David Liborio"), home
- Fluxo de download simulado: colar link → detectar plataforma → analisar → escolher formato → "processar" → resultado (tudo client-side, sem chamadas externas)
- Página do conversor (visual, aguardando Fase 3)
- Responsivo (mobile/tablet/desktop), microinterações, `prefers-reduced-motion` respeitado
- `GET /api/health` para checagem básica de status

## O que falta (próximas fases)

Providers reais (Instagram/YouTube), Provider Registry, integração Convertio, Supabase (histórico/settings), rate limiting e proteção SSRF, testes automatizados. Ver o prompt mestre do projeto para o roadmap completo (Fases 2–14).

## Variáveis de ambiente

Veja `.env.example`. Nenhuma é necessária para rodar a Fase 1.

---

Desenvolvido por David Liborio
