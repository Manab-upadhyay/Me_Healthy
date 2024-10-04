

const apiKeyMiddleware = (req, res, next) => {
    // Ensure environment variables are set
    const keyName = process.env.KEY_NAME;
    const keyValue = process.env.KEY_VALUE;
  
    if (!keyName || !keyValue) {
        console.error("API Key environment variables are not set");
        return res.status(500).json({ error: "Internal Server Error: API Key Configuration Missing" });
    }

    // Extract the API key from headers using the defined key name
    const apiKey = req.headers[keyName.toLocaleLowerCase()]; // Ensure header name is lowercase

    // Log the extracted API key for debugging
    console.log('Received API Key:', apiKey);

    // Validate the API key
    if (apiKey !== keyValue) {
        return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }

    // If the API key is valid, proceed to the next middleware or route handler
    next();
};

export default apiKeyMiddleware;
