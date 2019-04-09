import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import styled from "styled-components";

type Props = {
  title?: string;
};

const Container = styled("div")`
  background-color: #fff;
`;

class Layout extends React.PureComponent<Props> {
  render() {
    return (
      <Container>
        <Head>
          <title>{this.props.title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <header>
          <nav>
            <Link href="/">
              <a>Home</a>
            </Link>{" "}
          </nav>
        </header>
        {this.props.children}
        <footer>
          <hr />
          <span>I'm here to stay (Footer)</span>
        </footer>
      </Container>
    );
  }
}

export default Layout;
