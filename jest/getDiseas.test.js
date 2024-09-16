import request from 'supertest';  // Supertest for making requests to your API
import app from '../index.js';  // Import your Express app

describe("GET /api/getDiseases", () => {
    it("should return status code 200 and valid data", async () => {
        const res = await request(app)
            .get('/api/getDiseases?')
            .query({ disease: 'Fever'}) // Pass your query params here

        expect(res.statusCode).toBe(200);  // Check if the response status is 200

        // Test if the response is an object
        expect(typeof res.body).toBe('object');

        // Test if response contains 'id' field
        expect(res.body).toHaveProperty('id');

        // Test if 'symptoms', 'treatment', etc., are non-empty arrays
        expect(Array.isArray(res.body.symptoms)).toBe(true);
        expect(res.body.symptoms.length).toBeGreaterThan(0);

        expect(Array.isArray(res.body.treatment)).toBe(true);
        expect(res.body.treatment.length).toBeGreaterThan(0);

        expect(Array.isArray(res.body.bestLocationForTreatment.locations)).toBe(true);
        expect(res.body.bestLocationForTreatment.locations.length).toBeGreaterThan(0);

        expect(Array.isArray(res.body.preventionTips)).toBe(true);
        expect(res.body.preventionTips.length).toBeGreaterThan(0);
    });

    it("should handle error responses", async () => {
        const res = await request(app)
            .get('/api/getDiseases?')
            .query({ disease: '' })  // Sending an invalid request

        expect(res.statusCode).not.toBe(200);  // Check if the response status is not 200

        // Test if the response contains an 'error' field in case of failure
        expect(res.body).toHaveProperty('error');
        expect(typeof res.body.error).toBe('string');
    });
});

