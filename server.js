const express = require("express");
const bodyParser = require("body-parser");
const ono = require("@jsdevtools/ono"); // <- importando Ono
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint principal
app.post("/api", async (req, res) => {
    const corpo = req.body;

    try {
        if (!corpo || typeof corpo.respostas !== 'string') {
            throw new Error('O corpo da requisição deve ser um JSON contendo a chave "respostas" com uma string JSON aninhada.');
        }

        let respostasComoString = corpo.respostas;
        let jsonInterno;

        try {
            jsonInterno = JSON.parse(respostasComoString);
        } catch {
            try {
                respostasComoString = respostasComoString.replace(/\\/g, "");
                jsonInterno = JSON.parse(respostasComoString);
            } catch {
                throw new Error("Não foi possível converter a string JSON interna.");
            }
        }

        // Remove flow_token
        if ('flow_token' in jsonInterno) {
            delete jsonInterno.flow_token;
        }

        const camposOrdenados = Object.keys(jsonInterno)
            .sort((a, b) => {
                const regex = /screen_(\d+)_.*?(\d+)$/i;
                const matchA = a.match(regex);
                const matchB = b.match(regex);

                if (!matchA) return 1;
                if (!matchB) return -1;

                const screenA = parseInt(matchA[1]);
                const fieldA = parseInt(matchA[2]);
                const screenB = parseInt(matchB[1]);
                const fieldB = parseInt(matchB[2]);

                if (screenA !== screenB) return screenA - screenB;
                return fieldA - fieldB;
            })
            .map((key) => {
                let valor = jsonInterno[key];
                if (typeof valor === 'string') {
                    valor = valor.replace(/^\d+?_/, "");
                    valor = valor.replace(/_/g, " ");
                }
                return valor;
            });

        const respostas = {};
        camposOrdenados.forEach((valor, i) => {
            respostas[`resposta${i + 1}`] = valor;
        });

        return res.status(200).json({ respostas });
    } catch (err) {
        // Tratamento de erro usando Ono
        console.error(ono(err, "Erro no endpoint /api"));
        return res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
