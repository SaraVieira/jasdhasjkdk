import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";

import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prism-theme-night-owl";

// import "./vs-light-theme.css";
import "./dank-mono.css";
import "./style.css";
import { headingRenderer, RootRenderer } from "../utils/renderers";

function codeBlock({ value, language }) {
  if (!value) return null;

  const lang = language || "bash";
  var html = Prism.highlight(value, Prism.languages[lang]);
  var cls = "lang-" + lang;

  return (
    <pre className={cls}>
      <code dangerouslySetInnerHTML={{ __html: html }} className={cls} />
    </pre>
  );
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const markdownBook = data.markdownRemark;
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Opinionated guide to React" />
      <ReactMarkdown
        renderers={{
          code: codeBlock,
          heading: headingRenderer,
          root: RootRenderer
        }}
        source={markdownBook.rawMarkdownBody}
      />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark {
      rawMarkdownBody
    }
  }
`;
