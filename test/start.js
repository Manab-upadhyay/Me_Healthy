import app from './index.js';  // Import the app
// import redisClient from './redis.js';
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// redisClient.ping((err, response) => {
//   if (err) {
//     console.error('Redis ping error:', err);
//   } else {
//     console.log('Redis ping response:', response);
//   }
// });