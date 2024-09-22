import express from "express"
const  router= express.Router();
import diseasesData from '../data/data.json' with { type: "json" };
import redisClient from "../redis.js";
router.get('/api/getDiseasesBySymptom', async (req, res) => {
    try {
        const symptomQuery = req.query.symptoms;
        console.log(`Symptom Query: ${symptomQuery}`);

        if (!symptomQuery) {
            return res.status(400).json({ error: "Symptom query parameter is required" });
        }

        const symptomsArray = symptomQuery.split(',').map(symptom => symptom.trim().toLowerCase());
        console.log(symptomsArray);

        // Composite key for cache
        const cacheKey = `symptoms_${symptomsArray.join(',')}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            // If data is found in the cache, filter it based on the symptoms provided
            console.log('Cache hit for:', cacheKey);
            return res.status(200).json(JSON.parse(cachedData));
         
        }

        // Cache miss; compute and store the data
        console.log('Cache miss for:', cacheKey);
        const data = diseasesData.diseases.filter(disease =>
            symptomsArray.every(symptom =>
                disease.symptoms.some(diseaseSymptom => diseaseSymptom.toLowerCase().includes(symptom)) ||
                disease?.keywords?.some(keyword => keyword.toLowerCase().includes(symptom))
            )
        );

        if (data.length > 0) {
            // Store the result in Redis for 1 hour
            redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
            return res.status(200).json({ data });
        } else {
            return res.status(404).send({ error: `Data not found for symptoms: ${symptomsArray}` });
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router