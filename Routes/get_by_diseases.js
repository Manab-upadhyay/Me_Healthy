import express from "express";
import diseasesData from '../data/data.json' with { type: "json" };
import diseasesData2 from '../data/data2.json' with { type: "json" };
import diseasesData3 from '../data/data3.json' with { type: "json" };
import diseasesData4 from '../data/data4.json' with { type: "json" };
import data_hindi from "../data/data-hi.json" with { type: "json" };
import data_hindi1 from "../data/data-hi-2.json" with { type: "json" };
import map from "../data/map.json" with { type: "json" };
import redisClient from "../redis.js";

const router = express.Router();

router.get('/api/getDiseases', async (req, res) => {
    try {
      const diseaseQuery = req.query.disease?.trim();
      const language = req.query.lang?.toLowerCase();
  
      if (!diseaseQuery) {
        return res.status(400).json({ error: "Please provide a disease name in the query." });
      }
  
      // Normalize the disease query (lowercase and remove extra spaces)
      const normalizedDiseaseQuery = diseaseQuery.toLowerCase().replace(/\s+/g, ' ');
  
      const cacheKey = `${language || 'english'}_${normalizedDiseaseQuery}`;
      console.log("Cache Key:", cacheKey);
  
      // Check Redis cache
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        return res.status(200).json(JSON.parse(cachedData));
      }
  
      console.log('Cache miss:', cacheKey);
      let data = null;
  
      // Handle Hindi language query
      if (language === 'hindi' || language === 'hi') {
        const mappedDiseaseName = map.diseaseMapping[normalizedDiseaseQuery];
  
        if (!mappedDiseaseName) {
          return res.status(404).json({ error: `Disease name not found for: ${diseaseQuery} in language: ${language}` });
        }
  
        data = data_hindi.diseases.find(disease =>
          disease.diseaseName?.toLowerCase().includes(mappedDiseaseName.toLowerCase())
        ) || data_hindi1.diseases.find(disease =>
          disease.diseaseName?.toLowerCase().includes(mappedDiseaseName.toLowerCase())
        );
  
        if (data) {
          await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
          return res.status(200).json(data);
        } else {
          return res.status(404).json({ error: `No data found for the disease: ${mappedDiseaseName}` });
        }
      }
  
      // Handle English and default language queries
      if (language && language !== 'en') {
        return res.status(400).json({ error: "Language not supported." });
      } else {
        // Searching for the disease in English data (normalize names)
        data = diseasesData.diseases.find(disease =>
          disease.diseaseName?.toLowerCase().includes(normalizedDiseaseQuery)
        ) || diseasesData2.diseases.find(disease =>
          disease.diseaseName?.toLowerCase().includes(normalizedDiseaseQuery)
        ) || diseasesData3.diseases.find(disease =>
          disease.diseaseName?.toLowerCase().includes(normalizedDiseaseQuery)
        ) || diseasesData4.diseases.find(disease =>
          disease.diseaseName?.toLowerCase().includes(normalizedDiseaseQuery)
        );
  
        if (data) {
          await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
          return res.status(200).json(data);
        } else {
          return res.status(404).json({ error: `No data found for the disease: ${diseaseQuery}. Please check the spelling and try again.` });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

export default router;
