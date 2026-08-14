export async function onRequestGet(context: {
  request: Request;
  env: {
    GITHUB_CLIENT_ID?: string;
  };
}) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response(
      "Missing GITHUB_CLIENT_ID environment variable in Cloudflare Pages Settings.",
      { status: 500 }
    );
  }

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("scope", "repo,user");
  githubAuthUrl.searchParams.set("redirect_uri", `${url.origin}/api/callback`);

  return Response.redirect(githubAuthUrl.toString(), 302);
}
