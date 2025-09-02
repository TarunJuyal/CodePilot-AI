export async function postQuery(endpoint: string, data: unknown) {
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY!}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
