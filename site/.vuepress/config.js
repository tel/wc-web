module.exports = {

  title: "Well Conditioned",
  description: "Solving problems in the intersection of computational theory, data science, and software craft.",

  ga: "UA-120212012-1",

  themeConfig: {
    search: false,
    nav: [
      { text: "Home", link: "/" },
      { text: "Articles", link: "/articles/" },
      { text: "Talks", link: "/talks/" },
      { text: "Contact", link: "/contact/" }
    ]
  },

  head: [
    ["link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" }],
    ["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css" }]
  ],

  markdown: {
    lineNumbers: false,
    anchor: {
      permalink: true,
      permalinkSymbol: "§",
      permalinkBefore: false
    },
    toc: {
      includeLevel: [2, 3]
    },
    config: md => {
      md.use(require("markdown-it-katex"));
    }
  }

}
