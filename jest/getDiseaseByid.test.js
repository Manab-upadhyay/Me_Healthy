import request from 'supertest';
import app from '../index'; // Replace with the path to your Express app

describe('GET /api/getDiseasesById/:id', () => {
  it('should return status 200 and a valid array of diseases', async () => {
    const response = await request(app)
      .get('/api/getAllDiseases').query({id:'2'})// Adjust the endpoint and query parameters as needed
    

    expect(response.status).toBe(200);
    const jsonData = response.body;

    // Test if the response is an array
    expect(Array.isArray(jsonData)).toBe(true);

    // Check if the array is not empty
    expect(jsonData.length).toBeGreaterThan(0);

    // Iterate through the array to check each disease object
    jsonData.forEach(disease => {
      // Check required fields
      expect(disease).toHaveProperty('id');
      expect(disease).toHaveProperty('diseaseName');
      expect(disease).toHaveProperty('description');
      expect(disease).toHaveProperty('symptoms');
      expect(disease).toHaveProperty('treatment');
      expect(disease).toHaveProperty('bestLocationForTreatment');
      expect(disease).toHaveProperty('preventionTips');
      expect(disease).toHaveProperty('recoveryTime');
      expect(disease).toHaveProperty('costEstimate');
      expect(disease).toHaveProperty('keywords');
      expect(disease).toHaveProperty('error');

      // Convert `diseaseName` to string if it's an array
      const diseaseNameStr = Array.isArray(disease.diseaseName) ? disease.diseaseName.join(", ") : disease.diseaseName;

      // Test if diseaseName is a string
      expect(typeof diseaseNameStr).toBe('string');

      // Check that 'symptoms', 'treatment', 'bestLocationForTreatment.locations', and 'preventionTips' are arrays
      expect(Array.isArray(disease.symptoms)).toBe(true);
      expect(disease.symptoms.length).toBeGreaterThan(0);

      expect(Array.isArray(disease.treatment)).toBe(true);
      expect(disease.treatment.length).toBeGreaterThan(0);

      expect(Array.isArray(disease.bestLocationForTreatment.locations)).toBe(true);
      expect(disease.bestLocationForTreatment.locations.length).toBeGreaterThan(0);

      expect(Array.isArray(disease.preventionTips)).toBe(true);
      expect(disease.preventionTips.length).toBeGreaterThan(0);

      // Check if 'id' and 'diseaseName' have valid data types
      expect(typeof disease.id).toBe('string');
   
    });
  });
});
