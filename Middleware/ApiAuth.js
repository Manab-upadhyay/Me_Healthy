const apiKeyMiddleware = (req, res, next) => {
    // Extract the API key from headers (use 'manabtest' as the custom header)
    const apiKey = req.headers['manabtest'];

    // Log the extracted API key for debugging
    console.log('Received API Key:', apiKey);

    // Validate the API key
    if (apiKey !== 'ManabTest') {
        return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }

    // If the API key is valid, proceed to the next middleware or route handler
    next();
};

export default apiKeyMiddleware;
