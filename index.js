import bodyParser from "body-parser";
import express from "express"
import getDiseases from './Routes/get_by_diseases.js'
import getdiseasesById from "./Routes/get_by_id.js"
import getdisesesBySymp from "./Routes/get_diseasesBySym.js"
import getLocationForCure from "./Routes/getLocationBestForCure.js"
import getCureDiseaseByExcersise from "./Routes/getCureDiseaseByEx.js"
import personalisedPlan from "./Routes/get_personalisedPlan.js"
import getalldisease from "./Routes/getallDiseases.js"
import apiKeyMiddleware from "./Middleware/ApiAuth.js";
import loger from "morgan"
const app= express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apiKeyMiddleware)
app.use(loger("dev"))
app.use('/',getDiseases)
app.use('/', getdiseasesById)
app.use('/', getdisesesBySymp)
app.use('/', getLocationForCure)
app.use('/',getCureDiseaseByExcersise)
app.use('/', personalisedPlan)
app.use('/', getalldisease)

export default app;
