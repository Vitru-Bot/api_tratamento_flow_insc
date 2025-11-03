export default async function onRequest(context) {
  const { request } = context;

  if (request.method === "POST") {
    const corpo = await request.json();
    // validar, parse, organizar respostas
    return new Response(JSON.stringify({ respostas }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("🚀 API do tratamento de flow está ativa!", { status: 200 });
}
