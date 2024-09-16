import request from 'supertest';
import app from '../index'; // Replace with the path to your Express app

describe('GET /api/personalisedPlan', () => {
  it('should return status 200 and have required fields', async () => {
    const response = await request(app)
      .get('/api/personalisedPlan') // Adjust the endpoint and query parameters as needed
      .query({ disease:'Malaria'/* query parameters if any */ });

    expect(response.status).toBe(200);

    // Check if response contains required fields
    expect(response.body).toHaveProperty('disease');
    expect(response.body).toHaveProperty('goal');
    expect(response.body).toHaveProperty('dietPlan');
    expect(response.body).toHaveProperty('exercisePlan');

    // Check the types of the fields
    expect(typeof response.body.disease).toBe('string');
    expect(typeof response.body.goal).toBe('string');
    expect(typeof response.body.dietPlan).toBe('object');
    expect(typeof response.body.exercisePlan).toBe('object');
  });

  it('should handle error responses correctly', async () => {
    const response = await request(app)
      .get('/api/personalisedPlan') // Adjust the endpoint and query parameters as needed
      .query({ disease:'qwert'/* query parameters that trigger an error */ });

    if (response.status !== 200) {
      // Check if the error response contains an 'error' field
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    }
  });
});
