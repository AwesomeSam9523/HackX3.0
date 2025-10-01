export default function DashboardPage() {
  // redirect to /dashboard/login
  if (typeof window !== "undefined") {
    window.location.href = "/dashboard/login";
  } else {
    // server side redirect
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content="0; URL='/dashboard/login'" />
          <title>MUJ HackX 3.0 Dashboard</title>
        </head>
        <body>Redirecting you to login...</body>
      </html>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      Redirecting you to login...
    </div>
  );
}
