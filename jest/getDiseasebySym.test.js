import request from 'supertest';
import app from '../index'; // Adjust the path to your Express app

describe('GET /api/getDiseasesBySymtom', () => {
  it('should return status code 200 and valid data', async () => {
    const res = await request(app)
      .get('/api/getDiseasesBySymtom')
      .query({ symptoms: 'headache' }); // Adjust query parameters as needed

    expect(res.statusCode).toBe(200);

    const jsonData = res.body.data;

    // Check if the response body is an array and contains items
    expect(jsonData).toBeInstanceOf(Array);
    expect(jsonData.length).toBeGreaterThan(0);

    // Iterate through each item in the array
    jsonData.forEach(item => {
      expect(item).toHaveProperty('id');
   
      expect(item).toHaveProperty('diseaseName');
     
      expect(item).toHaveProperty('description');
   
      expect(item).toHaveProperty('symptoms');
      expect(item.symptoms).toBeInstanceOf(Array);
      expect(item.symptoms.length).toBeGreaterThan(0);
      expect(item).toHaveProperty('treatment');
      expect(item.treatment).toBeInstanceOf(Array);
      expect(item.treatment.length).toBeGreaterThan(0);
      expect(item).toHaveProperty('bestLocationForTreatment');
      expect(item.bestLocationForTreatment).toBeInstanceOf(Object);
      expect(item.bestLocationForTreatment).toHaveProperty('locations');
      expect(item.bestLocationForTreatment.locations).toBeInstanceOf(Array);
      expect(item.bestLocationForTreatment.locations.length).toBeGreaterThan(0);
      expect(item).toHaveProperty('preventionTips');
      expect(item.preventionTips).toBeInstanceOf(Array);
      expect(item.preventionTips.length).toBeGreaterThan(0);
      expect(item).toHaveProperty('recoveryTime');
      
      expect(item).toHaveProperty('keywords');
      expect(item.keywords).toBeInstanceOf(Array);
      expect(item.keywords.length).toBeGreaterThan(0);
      expect(item).toHaveProperty('costEstimate');
    
      expect(item).toHaveProperty('error');

    });
  });

  it('should handle error responses', async () => {
    const res = await request(app)
      .get('/api/getDiseasesBySymtom')
      .query({ disease: 'qwewr' }); // Example for error case

    expect(res.statusCode).not.toBe(200);

    const jsonData = res.body;
    
    // Ensure the error response contains an 'error' field
    expect(jsonData).toHaveProperty('error');
   
  });
});
