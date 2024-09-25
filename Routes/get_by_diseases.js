import express from "express";
import diseasesData from '../data/data.json' with { type: "json" };
import data_hindi from "../data/data-hi.json" with { type: "json" };
import data_hindi1 from "../data/data-hi-1.json" with { type: "json" };
import map from "../data/map.json" with { type: "json" };
import redisClient from "../redis.js";

const router = express.Router();

router.get('/api/getDiseases', async(req, res) => {
    try {
        const diseaseQuery = req.query.disease;
        const language = req.query.lang;

        if (!diseaseQuery) {
            return res.status(400).send({ error: "Please provide a disease name in the query." });
        }
        const normalizedDiseaseQuery = diseaseQuery.charAt(0).toUpperCase() + diseaseQuery.slice(1).toLowerCase();
        console.log(normalizedDiseaseQuery)
        const cacheKey = `${language || 'english'}_${normalizedDiseaseQuery}`;
   


        const cachedData = await redisClient.get(cacheKey);
      

        if (cachedData&&cachedData.length>0) {
            // If data is found in the cache, return it
            console.log('Cache hit:', cacheKey);
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss:', cacheKey);

            let data = null;

            // If the request is for Hindi data
            if (language === 'hindi') {
                const mappedDiseaseName = map.diseaseMapping[normalizedDiseaseQuery];
                console.log(mappedDiseaseName);

                if (!mappedDiseaseName) {
                    return res.status(404).send({ error: `Disease name not found for ${diseaseQuery} for the language: ${language}` });
                }

                data = data_hindi.diseases.find(disease => disease.diseaseName?.includes(mappedDiseaseName)) ||
                       data_hindi1.diseases.find(disease => disease.diseaseName?.includes(mappedDiseaseName));

                if (data) {
                    // Store the result in Redis for 1 hour
                    redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
                    return res.status(200).json(data);
                } else {
                    return res.status(404).json({ error: `No data found for the disease: ${mappedDiseaseName}` });
                }
            }

            // If the request is for English data
            if (language && language !== 'hindi'&&language!='en') {
                return res.status(400).json({ error: "Language not supported." });
            } else {
                // Searching for the disease in English data
                data = diseasesData.diseases.find(disease => disease.diseaseName?.includes(normalizedDiseaseQuery));

                if (data) {
                    // Store the result in Redis for 1 hour
                    redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
                    return res.status(200).json(data);
                } else {
                    return res.status(404).json({ error: `No data found for the disease: ${diseaseQuery}. Please check the spelling and try again.` });
                }
            }
      

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
