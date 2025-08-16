# Mundo Encantado do Brinquedo (estático)

Site de loja **100% estático** (HTML/CSS/JS) pronto para publicar no **GitHub Pages**, **Netlify** ou **Vercel**.

## Recursos
- Catálogo de produtos, busca e filtro por idade
- Carrinho (localStorage), cupom (`BRINCO10` 10% e `FREEDEL` frete grátis)
- Frete **simulado** por CEP (par = grátis, ímpar = R$15) no plano gratuito
- Feedback de clientes (localStorage)
- Formulário de contato via **Formspree** (gratuito) — edite a action
- Botões de checkout **Sandbox** para PayPal e PagSeguro (substitua pelos seus links oficiais)

## Como publicar no GitHub Pages
1. Crie um repositório `mundo-encantado` e envie os arquivos desta pasta.
2. Em **Settings → Pages**, selecione `Branch: main` e `/root` → Save.
3. O link ficará como `https://SEU_USUARIO.github.io/mundo-encantado/`.

## Configurações
- `index.html` → troque `https://formspree.io/f/SEU_ID_AQUI` pelo ID do seu formulário.
- Para pagamentos reais, substitua os links de sandbox pelos seus checkouts.
