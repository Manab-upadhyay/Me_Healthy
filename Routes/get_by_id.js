import express from "express";
import diseasesData from '../data/data.json' with { type: "json" };
import data_hindi from "../data/data-hi.json" with { type: "json" };
import data_hindi1 from "../data/data-hi-1.json" with { type: "json" };
import redisClient from "../redis.js";
const router = express.Router();

router.get('/api/getDiseasesById/:id', async(req, res) => {
    try {
        const params = req.params.id;  // Ensure params is a string

        const language = req.query.lang;
        const cacheKey = `${params}_${language||'English'}`
   


        const cachedData = await redisClient.get(cacheKey);
      

        if (cachedData&&cachedData.length>0) {
            // If data is found in the cache, return it
            console.log('Cache hit:', cacheKey);
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss:', cacheKey);

        if (language) {
            if (language === 'hindi') {
                const data_h = data_hindi.diseases.find(disease => disease.id === params) ||
                             data_hindi1.diseases.find(disease => disease.id === params);
                
                if (data_h) {
                    redisClient.setEx(cacheKey, 3600, JSON.stringify(data_h));
                    return res.status(200).json(data_h);
                } else {
                    return res.status(404).json({ error: `Data not found for the id: ${params}` });
                }
            } else {
                return res.status(400).json({ error: `${language} language is not supported at this time` });
            }
        } else {
            const data = diseasesData.diseases.find(disease => disease.id === params);

            if (data) {
                redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
                return res.status(200).json(data);
            } else {
                return res.status(404).json({ error: `No disease found corresponding to the id: ${params}` });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
