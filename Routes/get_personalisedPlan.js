import express from "express";

import plans from '../data/plan.json' with { type: "json" };
import plans1 from '../data/plan2.json' with { type: "json" };
import plan2 from '../data/plan3.json' with { type: "json" };
import redisClient from "../redis.js";
const router = express.Router();

router.get('/api/personalisedPlan', async(req, res) => {
    try {
        const query = req.query.disease;  // Assuming query parameter is disease
        console.log("Query received: ", query);
        
        // Combine the plan data
        // const combined_data = { ...plans  ...plan2  ...plans1 };
        // console.log(combined_data)

        // Check if query is provided
        const normalised = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
        if (!query) {
            return res.status(400).json({ error: "Disease query parameter is missing." });
        }
        const cacheKey = `${normalised}`;
   


        const cachedData = await redisClient.get(cacheKey);
      

        if (cachedData) {
            // If data is found in the cache, return it
            console.log('Cache hit:', cacheKey);
            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log('Cache miss:', cacheKey);
        // Find the matching disease plan
        const data = plans.personalizedPlan.find(disease => disease.disease?.includes(normalised))||plans1.personalizedPlan.find(disease => disease.disease?.includes(normalised))
        ||plan2.personalizedPlan.find(disease => disease.disease?.includes(normalised))
        redisClient.setEx(cacheKey, 3600, JSON.stringify(data));

        // If the disease is not found, return 404
        if (!data) {
            return res.status(404).json({ error: `No plan found for the disease: ${query}, re-check your querry` });
        }

        // Send the found data as a response
        console.log("Data found: ", data);
        return res.status(200).json(data);

    } catch (error) {
        console.error("Error occurred: ", error);
        return res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

export default router;
