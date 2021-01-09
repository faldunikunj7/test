module.exports={
    db: {
        url: process.env.mongodbUrl||"mongodb://localhost:27017/test"
    },
    app: {
        port: process.env.PORT||3300,
    },
    jwtToken: {
        secretKey: process.env.jwtSecretKey||"testKey",
        expiresIn: process.env.jwtExpiryTime||"1d"
    }
}