import express from "express";
const router = express.Router();
import diseasesData from '../data/data.json' with { type: "json" };

router.get('/api/getCureDiseasesByexcersise', (req, res) => {
    try {
        const searchQuery = req.query.excersise;
        console.log(searchQuery);
        if (!searchQuery) {
            return res.status(400).json({ error: "Exercise query parameter is required" });
        }

        const exercisesArray = searchQuery.split(',').map(exercise => exercise.trim().toLowerCase());
        console.log(exercisesArray);

        const data = diseasesData.diseases.filter(disease =>
            exercisesArray.every(exercise =>
                disease.exercise.some(ex => ex.toLowerCase().includes(exercise)) ||
                disease?.keywords?.some(keyword => keyword.toLowerCase().includes(exercise))
            )
        );

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
