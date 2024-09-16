import express from "express"
const router = express.Router();
import diseasesData from '../data/data.json' with { type: "json" };

router.get('/api/getLocationBestForCure',(req,res)=>{
    try {
        const locationParams = req.query.Location;
        console.log(locationParams);

        if (!locationParams) {
            return res.status(400).json({ error: "Location parameter is required" });
        }

        const locationArray = locationParams.split(',').map(location => location.trim().toLowerCase());
        console.log(locationArray);

        // Filter diseases based on location
        const filteredData = diseasesData.diseases.filter(disease => {
            // Assuming `bestLocationForTreatment` is an object and `locations` is an array of strings
            const locations = disease.bestLocationForTreatment?.locations

            // Check if any location from locationArray is in the disease's locations
     
            return locationArray.some(loc => locations.map(l => l.toLowerCase()).includes(loc));

        });
        console.log(filteredData)
        if (Array.isArray(filteredData) && filteredData.length > 0) {
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