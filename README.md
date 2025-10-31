# API de Tratamento de Flow

Esta é uma API simples construída com Express.js para tratar e transformar o JSON de resposta de um flow (provavelmente de um chatbot ou sistema de mensagens automatizadas).

## Funcionalidade

A API expõe um único endpoint:

- `POST /tratar-flow`

Este endpoint recebe um JSON no formato enviado por uma plataforma de chatbot (o código sugere um padrão similar ao da Meta) e o transforma em um formato mais simples, com as respostas organizadas como "questao1", "questao2", etc.

## Como usar

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor:**
    ```bash
    npm start
    ```

A API estará rodando em `http://localhost:3000`.

## Exemplo de uso

**Requisição (exemplo de JSON de entrada):**

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "flow_response": {
              "responses": {
                "resposta_1": "Sim",
                "resposta_2": "Não",
                "outra_resposta": "Talvez"
              }
            }
          }
        }
      ]
    }
  ]
}
```

**Resposta (JSON transformado):**

```json
{
  "questoes": {
    "questao1": "Sim",
    "questao2": "Não",
    "questao3": "Talvez"
  }
}
```
