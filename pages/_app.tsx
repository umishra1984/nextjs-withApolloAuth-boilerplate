import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import App, { Container } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import ReactModal from "react-modal";
import "../empty.css";
import withApolloClient from "../lib/with-apollo-client";

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}
interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App<Props> {
  render(): JSX.Element {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
