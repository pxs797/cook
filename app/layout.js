import { Inter } from "next/font/google";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cook",
  description: "I know what you cooked.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
        id="clarityLoader"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "lpud1tu7mf");
          `,
        }}
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
