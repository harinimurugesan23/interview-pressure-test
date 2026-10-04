declare const AnnaAppRuntime: {
  connect: () => Promise<{
    llm: {
      complete: (args: {
        messages: Array<{
          role: "user" | "assistant" | "system";
          content: string;
        }>;
      }) => Promise<any>;
    };
  }>;
};

let annaPromise: ReturnType<typeof AnnaAppRuntime.connect> | null = null;

async function getAnna() {
  if (!annaPromise) {
    annaPromise = AnnaAppRuntime.connect();
  }
  return annaPromise;
}

export async function askAnna(prompt: string) {
  const anna = await getAnna();

  return anna.llm.complete({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}
