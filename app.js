const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')

app.use(cors())
app.options('*', cors())

// Middleware
app.use(express.json());
app.use(morgan('tiny'))
app.use(authJwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler)

// Routes
const categoriesRoutes = require('./routes/categories')
const productsRoutes = require('./routes/products')
const userRoutes = require('./routes/users')
const ordersRoutes = require('./routes/orders')
const {
  setRandomFallback
} = require('bcryptjs')

const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, userRoutes)
app.use(`${api}/orders`, ordersRoutes)

// Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'eshop-database'
  })
  .then(() => {
    console.log('Database Connection is ready...')
  }).catch(() => {
    console.log(err)
  })

// Server
app.listen(3000, () => {
  console.log(`Server is running http://localhost:3000`)
})