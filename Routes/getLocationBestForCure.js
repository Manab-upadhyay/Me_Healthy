import express from "express"
const router = express.Router();
import diseasesData from '../data/data.json' with { type: "json" };
import diseasesData2 from "../data/data2.json" with {type:"json"};
import diseasesData3 from "../data/data3.json" with {type:"json"}
import diseasesData4 from "../data/data4.json" with {type:"json"}
import redisClient from "../redis.js";

router.get('/api/getLocationBestForCure',async(req,res)=>{
    try {
        const locationParams = req.query.Location;
       

        if (!locationParams) {
            return res.status(400).json({ error: "Location parameter is required" });
        }

        const locationArray = locationParams.split(',').map(location => location.trim().toLowerCase());
        
        const cacheKey= `loc_${locationArray.join(',')}`
        const cachedData = await redisClient.get(cacheKey);
        if(cachedData&&cachedData.length>0){
            console.log('Cache hit for:', cacheKey);
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Filter diseases based on location
        const data =[...diseasesData.diseases, ...diseasesData2.diseases,...diseasesData3.diseases,...diseasesData4.diseases]
        const filteredData = data.filter(disease => {
            // Assuming `bestLocationForTreatment` is an object and `locations` is an array of strings
            const locations = disease.bestLocationForTreatment?.locations

            // Check if any location from locationArray is in the disease's locations
     
            return locationArray.some(loc => locations.map(l => l.toLowerCase()).includes(loc));

        });
        console.log(filteredData)
        if (Array.isArray(filteredData) && filteredData.length > 0) {
            redisClient.setEx(cacheKey, 3600, JSON.stringify(filteredData));
            return res.status(200).json(filteredData);
        } else {
            return res.status(404).json({ error: `No data found for the locations: ${locationArray.join(', ')}` });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

})
export default router