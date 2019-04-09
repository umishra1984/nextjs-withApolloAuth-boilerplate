import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import cookie from "cookie";
import { IncomingMessage } from "http";
import { NextContext } from "next";
import NextApp, {
  AppComponentType,
  AppProps,
  DefaultAppIProps,
  NextAppContext
} from "next/app";
import Head from "next/head";
import { DefaultQuery } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import { getDataFromTree } from "react-apollo";
import initApollo from "./init-apollo";
import { isBrowser } from "./isBrowser";

interface ApolloProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

interface AppContext<Q extends DefaultQuery = DefaultQuery>
  extends NextContext<Q>,
    // Custom prop added by withApollo
    ApolloProps {}

export interface ApolloContext<Q extends DefaultQuery = DefaultQuery>
  extends NextAppContext<Q> {
  ctx: AppContext<Q>;
}

export interface ApolloHocProps {
  apolloState: NormalizedCacheObject;
}

function parseCookies(
  req?: IncomingMessage,
  options = {}
): {
  [key: string]: string;
} {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}

const SERVER_LINK_OPTIONS = {
  uri: "http://localhost:4023/admin-api",
  credentials: "include"
};

export default <P extends DefaultAppIProps>(
  App: typeof NextApp & AppComponentType<P & ApolloProps, P>
) => {
  return class WithData extends React.Component<P & AppProps & ApolloHocProps> {
    static displayName = `WithData(${App.displayName})`;
    static propTypes = {
      apolloState: PropTypes.object.isRequired
    };

    static async getInitialProps(
      ctx: ApolloContext
    ): Promise<P & ApolloHocProps | {}> {
      const {
        Component,
        router,
        ctx: { req, res }
      } = ctx;
      const apollo = initApollo(
        SERVER_LINK_OPTIONS,
        {},
        {
          getToken: () => parseCookies(req).qid
        }
      );

      ctx.ctx.apolloClient = apollo;

      let appProps = { pageProps: {} };
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      if (!isBrowser) {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,

        apolloState
      };
    }

    apolloClient: ApolloClient<NormalizedCacheObject>;
    // githubApolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(props: P & AppProps & ApolloHocProps) {
      super(props);
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(SERVER_LINK_OPTIONS, props.apolloState, {
        getToken: () => {
          return parseCookies().qid;
        }
      });
    }

    render(): JSX.Element {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
