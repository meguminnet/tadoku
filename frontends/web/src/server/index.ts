import { getAllServices } from './src/app/services'
import express from 'express'
import next from 'next'
import proxy from 'http-proxy-middleware'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  for (const service of getAllServices()) {
    server.use(
      service.externalUrl,
      proxy.createProxyMiddleware({
        target: service.internalHost,
        changeOrigin: true,
        pathRewrite: { [`^${service.externalUrl}`]: '' },
      }),
    )
  }

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
