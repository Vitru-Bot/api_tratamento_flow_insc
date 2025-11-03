export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Método não permitido', { status: 405 });
    }

    let corpo;
    try {
      corpo = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Corpo inválido' }), { status: 400 });
    }

    try {
      if (!corpo || typeof corpo.respostas !== 'string') {
        throw new Error('O corpo da requisição deve conter "respostas" como string JSON');
      }

      let respostasComoString = corpo.respostas;
      let jsonInterno;

      try {
        jsonInterno = JSON.parse(respostasComoString);
      } catch {
        respostasComoString = respostasComoString.replace(/\\/g, '');
        jsonInterno = JSON.parse(respostasComoString);
      }

      if ('flow_token' in jsonInterno) delete jsonInterno.flow_token;

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
          return screenA !== screenB ? screenA - screenB : fieldA - fieldB;
        })
        .map((key) => {
          let valor = jsonInterno[key];
          if (typeof valor === 'string') {
            valor = valor.replace(/^\d+?_/, '');
            valor = valor.replace(/_/g, ' ');
          }
          return valor;
        });

      const respostas = {};
      camposOrdenados.forEach((valor, i) => {
        respostas[`resposta${i + 1}`] = valor;
      });

      return new Response(JSON.stringify({ respostas }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
