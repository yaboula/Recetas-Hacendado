require('dotenv').config();
const Groq = require('groq-sdk');

async function test() {
  console.log('── Test de conexión a Groq ──');
  console.log('API Key: ✅ Configurada');
  console.log('Modelo texto:', process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile');
  console.log('Modelo visión:', process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct');
  console.log('');

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Test 1: Modelo de texto (razonamiento)
  console.log('🧠 Probando modelo de razonamiento...');
  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Responde SOLO en JSON válido.' },
        { role: 'user', content: 'Responde con un JSON que tenga una clave "status" con valor "ok" y una clave "modelo" con tu nombre.' },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 256,
    });

    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);
    console.log('✅ Modelo de texto OK:', parsed);
    console.log('   Tokens usados:', response.usage?.total_tokens);
  } catch (error) {
    console.error('❌ Error modelo texto:', error.status, error.message);
  }

  // Test 2: Modelo de visión
  console.log('');
  console.log('📷 Probando modelo de visión...');
  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'user', content: 'Responde con un JSON que tenga "vision" con valor "ready". Solo JSON, nada más.' },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 256,
    });

    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);
    console.log('✅ Modelo de visión OK:', parsed);
    console.log('   Tokens usados:', response.usage?.total_tokens);
  } catch (error) {
    console.error('❌ Error modelo visión:', error.status, error.message);
  }

  console.log('');
  console.log('── Fin del test ──');
}

test();
