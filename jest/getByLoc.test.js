import request from 'supertest';  // Supertest for making requests to your API
import app from '../index.js';  // Adjust the path to your app file

describe('GET /api/getLocationBestForCure', () => {
  it('should return status 200 and a valid array of disease objects', async () => {
    const response = await request(app)
      .get('/api/getLocationBestForCure?').query({Location:"mumbai"}); // Adjust the endpoint and parameters as necessary

    // Check if the response status is 200
    expect(response.status).toBe(200);

    const jsonData = response.body;

    // Check if the response body is an array and contains items
    expect(Array.isArray(jsonData)).toBe(true);
    expect(jsonData.length).toBeGreaterThan(0);

    // Iterate through each item in the array
    jsonData.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(typeof item.id).toBe('string');

      expect(item).toHaveProperty('diseaseName');
      expect(typeof item.diseaseName).toBe('string');

      expect(item).toHaveProperty('description');
      expect(typeof item.description).toBe('string');

      expect(item).toHaveProperty('symptoms');
      expect(Array.isArray(item.symptoms)).toBe(true);
      expect(item.symptoms.length).toBeGreaterThan(0);

      expect(item).toHaveProperty('treatment');
      expect(Array.isArray(item.treatment)).toBe(true);
      expect(item.treatment.length).toBeGreaterThan(0);

      expect(item).toHaveProperty('bestLocationForTreatment');
      expect(typeof item.bestLocationForTreatment).toBe('object');
      expect(item.bestLocationForTreatment).toHaveProperty('locations');
      expect(Array.isArray(item.bestLocationForTreatment.locations)).toBe(true);
      expect(item.bestLocationForTreatment.locations.length).toBeGreaterThan(0);

      expect(item).toHaveProperty('preventionTips');
      expect(Array.isArray(item.preventionTips)).toBe(true);
      expect(item.preventionTips.length).toBeGreaterThan(0);

      expect(item).toHaveProperty('recoveryTime');
      expect(typeof item.recoveryTime).toBe('string');

      expect(item).toHaveProperty('keywords');
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThan(0);

      expect(item).toHaveProperty('costEstimate');
      expect(typeof item.costEstimate).toBe('string');

      expect(item).toHaveProperty('error');
      expect(typeof item.error).toBe('string');
    });
  });

  it('should return an error if the Location is not found', async () => {
    const response = await request(app)
      .get('/api/getLocationBestForCure?').query({Location:'wewe'}); // Use a non-existent ID to simulate an error

    // Check if the response status is not 200 (assuming 404 or another error code)
    expect(response.status).toBe(404); // Adjust if you expect a different error status

    // Validate the error field in the response body
    const jsonData = response.body;
    expect(jsonData).toHaveProperty('error');
    expect(typeof jsonData.error).toBe('string');
  });
});
