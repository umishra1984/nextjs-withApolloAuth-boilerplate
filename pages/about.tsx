import Link from "next/link";
import * as React from "react";
import Layout from "../components/Layout";

class AboutPage extends React.Component {
  render() {
    return (
      <Layout title="About | Next.js + TypeScript Example">
        <p>This is the about page</p>
        <p>
          <Link href="/">
            <a>Go home</a>
          </Link>
        </p>
      </Layout>
    );
  }
}
export default AboutPage;
