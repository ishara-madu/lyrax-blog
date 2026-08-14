export async function onRequestGet(context: {
  request: Request;
  env: {
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
  };
}) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code from GitHub", {
      status: 400,
    });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      "Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variable in Cloudflare Pages.",
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "LyraX-DecapCMS-OAuth",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error || !tokenData.access_token) {
      const errorMsg =
        tokenData.error_description || tokenData.error || "Failed to obtain token";
      return new Response(`GitHub OAuth Error: ${errorMsg}`, { status: 400 });
    }

    const token = tokenData.access_token;
    const provider = "github";

    const content = JSON.stringify({ token, provider });

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Authorizing Decap CMS...</title>
</head>
<body>
  <p style="font-family: sans-serif; text-align: center; margin-top: 40px;">
    Authorizing with GitHub... You may close this window if it does not close automatically.
  </p>
  <script>
    (function () {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:${provider}:success:${content}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:${provider}", "*");
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(`Authentication Error: ${message}`, { status: 500 });
  }
}
