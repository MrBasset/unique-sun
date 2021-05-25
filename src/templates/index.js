import * as React from "react";
import { Link, graphql } from "gatsby";

import Image from 'gatsby-image';

import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query loadIndex($id: String) {
    markdownRemark(id: {eq: $id}) {
      id
      frontmatter {
        title
        hero {
          childCloudinaryAsset {
            fixed {
              ...CloudinaryAssetFixed
            }
          }
        }
      }
    }
  }`

const IndexPage = ({data}) => (
  <Layout>
    <Seo title="Home" />
    <h1>{data.markdownRemark.frontmatter.title}</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Image fixed={data.markdownRemark.frontmatter.hero.childCloudinaryAsset.fixed}
      alt="A Gatsby astronaut"
      style={{ marginBottom: `1.45rem` }}
    />
    <p>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </p>
  </Layout>
)

export default IndexPage
