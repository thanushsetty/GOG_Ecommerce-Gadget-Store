const redis = require('redis');
 
const client = redis.createClient({
    password: 'Wnlwd57X3207WGnroDmd6zTtUAVizDSV',
    socket: {
        host: 'redis-11276.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: '11276'
    }
});

(async () => {
    await client.connect();
})();
client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = client;

