import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { saJson, region, model, systemPrompt, userPrompt } = body;

    if (!saJson) {
      return NextResponse.json({ error: 'Missing Service Account JSON' }, { status: 400 });
    }

    const sa = typeof saJson === 'string' ? JSON.parse(saJson) : saJson;
    const { client_email, private_key, project_id } = sa;

    // Use google-auth-library to get an access token
    const client = new JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    if (!token) {
      return NextResponse.json({ error: 'Failed to generate access token' }, { status: 500 });
    }

    const apiUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${project_id}/locations/${region}/publishers/google/models/${model}:generateContent`;

    const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.7, responseMimeType: 'text/plain' }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `API Error: ${response.status} - ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0].content) {
      return NextResponse.json({ error: 'Invalid response from Vertex AI' }, { status: 500 });
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ text: generatedText });
  } catch (error: unknown) {
    console.error('Vertex AI Error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
