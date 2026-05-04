# Dev Blog Architecture (Next.js 15 & MDX)

Um repositório de ponta focado em indexação técnica (Technical SEO) e alta performance. Este projeto foi concebido para hospedar conteúdo denso sobre Engenharia de Software utilizando as práticas e arquiteturas web mais robustas vigentes.

🟢 **[Live Demo](https://dev-blog-ten-rho.vercel.app)** — Deployed on Vercel

## Arquitetura e Stack

- **Framework Core**: Next.js 15 (App Router).
- **Conteúdo**: Arquitetura em *MDX* (Componentes React embarcados em Markdown). 
- **SSG Engine**: Geração instantânea (Static Site Generation) com o suporte da pipeline de build.
- **Design System**: Chakra UI v3 (Agnóstico, robusto e flexível).
- **SEO Automático**: Metadados dinâmicos e injeção estrutural de JSON-LD orientada a artigos.

## Executando Localmente

Para rodar a aplicação em um ambiente de desenvolvimento:

```bash
# Instale as dependências
npm install

# Inicie o servidor
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Adicionando Conteúdo

Para redigir uma nova postagem no Blog, crie um novo arquivo `.mdx` no respectivo diretório de dados em `/content/posts/` conforme a formatação e metadados requeridos:

```yaml
---
title: "Exemplo Título Do Post"
description: "Descrição usada pela metaclass na injeção de SEO."
date: "2026-04-14"
tags: ["Architecture", "Frontend Component"]
---
```

## Performance & Deploy
Projetado para obter máxima pontuação (100) pelo Lighthouse na entrega Core Web Vitals e renderização no limite (*Edge Computing*) pela Vercel. 

---
*Construído com excelência técnica usando RSC (React Server Components).*
