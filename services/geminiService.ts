import { ChatMessage, GroundingSource } from "../types";

// A lógica de chamada da API e as instruções do sistema foram movidas para um backend seguro.
// Este arquivo agora atua como um wrapper de cliente para o nosso novo endpoint de API.

export async function* streamResponse(
  history: ChatMessage[],
  useGoogleSearch: boolean
): AsyncGenerator<{ text?: string; sources?: GroundingSource[] | null }> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, useGoogleSearch }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    if (!response.body) {
        throw new Error("Response body is empty.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // Keep the last, possibly incomplete line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonString = line.substring(6);
          if (jsonString) {
            const data = JSON.parse(jsonString);
            
            // Mapeia os dados de fontes do servidor para o tipo do cliente
            const sources = data.sources?.map((c: any) => ({
                uri: c.web?.uri ?? '',
                title: c.web?.title ?? 'Fonte desconhecida'
            })).filter((s: GroundingSource) => s.uri);

            yield {
              text: data.text,
              sources: sources && sources.length > 0 ? sources : null
            };
          }
        }
      }
    }
  } catch (error) {
    console.error("API proxy error:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu uma falha ao comunicar com o servidor.";
    throw new Error(errorMessage);
  }
}