
const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    return graphql(`
    {
        others: allMarkdownRemark(filter: {frontmatter: {template: {ne: "event"}}}) {
            edges {
                node {
                    frontmatter {
                        template
                    }
                    id
                    fields {
                        slug
                    }
                }
            }
        }
    }
    `).then(result => {
        if (result.errors) {
            result.errors.forEach(e => console.error(e.toString()))
            return Promise.reject(result.errors)
        }

        const posts = result.data.others.edges

        posts.forEach(edge => {
            const id = edge.node.id

            //console.log(`Posts::Creating ${edge.node.frontmatter.template} page for ${edge.node.fields.slug}`);

            createPage({
                path: edge.node.fields.slug,
                component: path.resolve(
                    `src/templates/${String(edge.node.frontmatter.template)}.js`
                ),
                // additional data can be passed via context
                context: {
                    id,
                },
            })
        })
    })
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode })
        createNodeField({
            name: `slug`,
            node,
            value,
        })
    }
};


//TODO: Replace markdownToHtml with schemaCustomisation below
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes, createFieldExtension } = actions

    createFieldExtension({
        name: 'fileByAbsolutePath',
        extend: (options, prevFieldConfig) => ({
            resolve: function (src, args, context, info) {

                // look up original string, i.e img/photo.jpg
                const { fieldName } = info
                const partialPath = src[fieldName]

                if (!partialPath) {
                    return null
                }
            
                // get the absolute path of the image file in the filesystem
                const filePath = path.join(
                  __dirname,
                  'static',
                  partialPath
                )
            
                // look for a node with matching path
                // check out the query object, it's the same as a regular query filter
                const fileNode = context.nodeModel.runQuery({
                  firstOnly: true,
                  type: 'File',
                  query: {
                    filter: {
                      absolutePath: {
                        eq: filePath
                      }
                    }
                  }
                });
            
                // no node? return
                if (!fileNode) {
                  return null;
                }
            
                // else return the node
                return fileNode;
            }            
        })
    });

    const typeDefs = `

    type MarkdownRemark implements Node @infer {
        frontmatter: Frontmatter
    }

    type Frontmatter @Infer {
        hero: File @fileByAbsolutePath
        title: String
        template: String
    }`

    createTypes(typeDefs)
}