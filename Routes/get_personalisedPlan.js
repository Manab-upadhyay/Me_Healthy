import express from "express";
import plans from '../data/plan.json' with { type: "json" };
import plans1 from '../data/plan2.json' with { type: "json" };
import plan2 from '../data/plan3.json' with { type: "json" };
import plan3 from "../data/plan3.json" with {type:"json"};
import plan4 from "../data/plan4.json" with {type:"json"};
import plan5 from "../data/plan5.json" with {type:"json"};
import redisClient from "../redis.js";

const router = express.Router();

router.get('/api/personalisedPlan', async (req, res) => {
    try {
        const diseaseQuery = req.query.disease?.trim();

        if (!diseaseQuery) {
            return res.status(400).json({ error: "Disease query parameter is missing." });
        }

    
        const normalised = diseaseQuery.toLowerCase().replace(/\s+/g, ' ');
        const cacheKey = `${normalised}`;

        // Check Redis cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData && cachedData.length > 0) {
            console.log('Cache hit:', cacheKey);
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss:', cacheKey);

        // Combine all plan data into one array
        const allPlans = [
            ...plans.personalizedPlan,
            ...plans1.personalizedPlan,
            ...plan2.personalizedPlan,
            ...plan3.personalizedPlan,
            ...plan4.personalizedPlan,
            ...plan5.personalizedPlan
        ];

       
        const data = allPlans.find(disease => disease.disease?.toLowerCase().includes(normalised));

     
        if (data) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
         
            return res.status(200).json(data);
        } else {
            // If no data found
            return res.status(404).json({ error: `No plan found for the disease: ${diseaseQuery}, please re-check your query.` });
        }

    } catch (error) {
        console.error("Error occurred: ", error);
        return res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

export default router;
