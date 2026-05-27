# Paint to Paint

Um editor de desenho inspirado em programas clássicos de paint, desenvolvido com HTML5 Canvas e JavaScript puro.

## Funcionalidades

- Pincel
- Borracha
- Balde de tinta
- Formatos para o pincel
- Seleção de cores
- Modo Glow
- Upload de imagens PNG
- Download do desenho em PNG

---

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Canvas API

---

## Como executar

Clone o repositório:

```bash
git clone https://github.com/pietro-ferrarezi/PaintToPaint.git
```

Abra o arquivo:

```txt
index.html
```

em qualquer navegador moderno.

---

## Destaque

A ferramenta de balde utiliza o algoritmo Flood Fill com busca em largura (BFS).

### Funcionamento:
1. Captura todos os pixels do canvas
2. Identifica a cor original do ponto clicado
3. Percorre pixels vizinhos usando uma fila
4. Pinta apenas regiões com a mesma cor

---

## Licença

Projeto open-source para estudos e aprendizado.
