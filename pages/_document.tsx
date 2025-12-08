import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const miniappMeta = {
    version: "1",
    imageUrl: "https://dimension-service-explorer.vercel.app/favicon.ico",
    button: {
      title: "Open Dimension Service Explorer",
      action: {
        type: "launch_miniapp",
        url: "https://dimension-service-explorer.vercel.app",
        name: "Dimension Service Explorer",
        splashImageUrl: "https://dimension-service-explorer.vercel.app/favicon.ico",
        splashBackgroundColor: "#0B101A"
      }
    }
  };

  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Jura:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Farcaster Miniapp Meta Tag */}
        <meta 
          name="fc:miniapp" 
          content={JSON.stringify(miniappMeta)} 
        />
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dimension-service-explorer.vercel.app" />
        <meta property="og:title" content="Dimension Service Explorer" />
        <meta property="og:description" content="Find peace of mind through generative art & creators economy. Explore fractals, mint NFTs, and earn PSY tokens on Celo." />
        <meta property="og:image" content="https://dimension-service-explorer.vercel.app/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
