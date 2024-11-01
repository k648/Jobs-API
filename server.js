require('dotenv').config()

const express = require('express')
const bodyParser = require("body-parser")
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use(express.json());

const connectDB = require('./db/connect')
const jobRoute = require('./route/jobs')
const authRoute = require('./route/auth')
const auth  = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')



app.use('/api/v1/auth',authRoute)
app.use('/api/v1',auth,jobRoute)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
app.use(connectDB)
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

port = process.env.Port || 3000;


const start = async ()=>{
  try{  
    await connectDB(process.env.MONGO_URI)
    app.listen(port , ()=>{ console.log(`the server is listening on port ${port}...`)});
    } catch(error){
     console.log(error)
    }
}

start()