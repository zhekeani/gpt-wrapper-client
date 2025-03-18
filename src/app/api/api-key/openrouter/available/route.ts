export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const apiKey = json.apiKey;

    if (!apiKey) {
      return new Response(JSON.stringify({ message: "API key is required" }), {
        status: 400,
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Invalid API key";

      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse?.message || errorMessage;
      } catch (jsonError) {
        console.error("Failed to parse OpenRouter error response:", jsonError);
        throw new Error(
          "Failed to verify API key due to an unexpected response format."
        );
      }

      console.error("OpenRouter API validation failed:", errorMessage);
      return new Response(
        JSON.stringify({ isValid: false, message: errorMessage }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ isValid: true }), { status: 200 });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return new Response(
      JSON.stringify({ message: "An unexpected error occurred" }),
      { status: 500 }
    );
  }
}
