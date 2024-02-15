import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { useEffect } from 'react';
// import { Config } from '@/config';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    // const { locale } = this.props._NEXT_DATA_;
    // const dir = Config.getDirection(locale);

    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=optional"
            rel="stylesheet"
          />

          <link rel="icon" href="/favicon.ico" type="image/x-icon" />

          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
              window.Trengo = window.Trengo || {};
              window.Trengo.key = 'GRMl3SFGyc4GHMvkE4CX';
              (function(d, script, t) {
                  script = d.createElement('script');
                  script.type = 'text/javascript';
                  script.async = true;
                  script.src = 'https://static.widget.trengo.eu/embed.js';
                  d.getElementsByTagName('head')[0].appendChild(script);
              }(document));
              
              `,
            }}
          /> */}
          {/* <script
            src="//fw-cdn.com/10624225/3465209.js"
            data-chat="true"
          ></script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
