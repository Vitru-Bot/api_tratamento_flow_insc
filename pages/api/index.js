/**
 * API Route Handler (Next.js Pages Router)
 * @param {import('next').NextApiRequest} req - Objeto de requisição do Next.js.
 * @param {import('next').NextApiResponse} res - Objeto de resposta do Next.js.
 */
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido. Use POST." });
    }

    try {
        const corpo = req.body;
        
        if (!corpo || typeof corpo.respostas !== 'string') {
            return res.status(400).json({ 
                error: 'O corpo da requisição deve ser um JSON contendo a chave "respostas" com uma string JSON aninhada.' 
            });
        }
        
        let respostasComoString = corpo.respostas;
        let jsonInterno;

        // Tenta parsear o JSON interno (lidando com strings escapadas)
        try {
            jsonInterno = JSON.parse(respostasComoString);
        } catch {
            try {
                respostasComoString = respostasComoString.replace(/\\/g, "");
                jsonInterno = JSON.parse(respostasComoString);
            } catch {
                return res.status(400).json({ error: "Não foi possível converter a string JSON interna." });
            }
        }

        // Remove o flow_token antes de processar
        if ('flow_token' in jsonInterno) {
            delete jsonInterno.flow_token;
        }

        // Ordena os campos normalmente
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

        // Monta o objeto final com resposta1, resposta2, ...
        const respostas = {};
        camposOrdenados.forEach((valor, i) => {
            respostas[`resposta${i + 1}`] = valor;
        });

        // Retorna o sucesso apenas com respostas
        return res.status(200).json({ respostas });

    } catch (err) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({ error: "Erro interno ao processar requisição." });
    }
}
