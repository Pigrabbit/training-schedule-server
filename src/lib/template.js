module.exports = {
  HTML: function (title, list, body, control, authStatusUI = '<a href="/login">login</a>') {
    return `
    <!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
        ${authStatusUI}
      <h1>Training Schedule Server</h1>
        ${list}
        ${control}
        ${body}
    </body>
    </html>
    `
  }
}
