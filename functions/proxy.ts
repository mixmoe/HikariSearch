export const onRequestGet: PagesFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  if (!imageUrl) {
    return new Response(null, { status: 400 });
  }
  const { body, headers } = await fetch(imageUrl);
  if (!headers.get('Content-Type')?.startsWith('image/')) {
    return new Response(null, { status: 500 });
  }
  return new Response(body, { headers });
};
