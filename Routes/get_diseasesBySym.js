import express from "express"
const  router= express.Router();
import diseasesData from '../data/data.json' with { type: "json" };
router.get('/api/getDiseasesBySymtom', (req, res) => {
    try {
        const symptomQuery = req.query.symptoms;
        console.log(`Symptom Query: ${symptomQuery}`);

        if (!symptomQuery) {
            return res.status(400).json({ error: "Symptom query parameter is required" });
        }

else{
        const symptomsArray = symptomQuery.split(',').map(symptom => symptom.trim().toLowerCase());
console.log(symptomsArray);
  
        const data = diseasesData.diseases.filter(disease =>
            symptomsArray.every(symptom =>
                disease.symptoms.some(diseaseSymptom => diseaseSymptom.toLowerCase().includes(symptom)) ||
                disease?.keywords?.some(keyword => keyword.toLowerCase().includes(symptom))
            )
        );
        if(data.length>0){

        return res.status(200).json({ data });
        }
        else{
            return res.status(404).send({error:`Data not found for the symtoms:${symptomsArray} or check the spelling and try`})
        }
    }
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;