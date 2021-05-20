import * as React from "react";
import { Link, graphql } from "gatsby";

import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query loadIndex($id: String) {
    markdownRemark(id: {eq: $id}) {
      id
      frontmatter {
        title
        hero {
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
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
    <GatsbyImage image={getImage(data.markdownRemark.frontmatter.hero)}
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
