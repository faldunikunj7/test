module.exports= {
    db:{
        url:"mongodb://localhost:27017/test"
    },
    app:{
        port:3300,
    },
    jwtToken:{
        secretKey:"testKey",
        expiresIn:"1d"
    }
}