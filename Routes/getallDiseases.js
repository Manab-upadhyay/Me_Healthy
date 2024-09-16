import express from "express";

import diseasesData from '../data/data.json' with { type: "json" };
const router = express.Router();
router.get('/api/getAllDiseases', (req, res) => {
    try {
        
        const data = diseasesData.diseases;
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
       
        return res.status(500).send("Internal server error");
    }
});

export default router;
