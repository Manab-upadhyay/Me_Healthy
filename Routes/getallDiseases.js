import express from "express";
import diseasesData from '../data/data.json' with { type: "json" };
import diseaseData2 from "../data/data2.json" with {type:"json"}
import diseaseData3 from "../data/data3.json" with {type:"json"}
import diseaseData4 from "../data/data4.json" with {type:"json"}
import redisClient from "../redis.js";
const router = express.Router();

router.get('/api/getAllDiseases', async (req, res) => {
    try {
        const cacheKey = "EncoderManab";
       
        const cacheData = await redisClient.get(cacheKey);
        
    
        if (cacheData) {
            console.log('Cache hit for:', cacheKey);
            return res.status(200).send(JSON.parse(cacheData)); // Use cache data if it exists
        }

        // If no cache data, use diseasesData and cache it
        const data = [...diseasesData.diseases,...diseaseData2.diseases, ...diseaseData3.diseases,...diseaseData4.diseases]

        
        // Cache the data for future use, set expiration to 3600 seconds (1 hour)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));

        return res.status(200).send(data); // Return the diseases data
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
});

export default router;
