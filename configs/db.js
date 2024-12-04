

const connectDB = async () => {
    try {
        const conn = await require('mongoose').connect(process.env.MONGO_RUI);


        console.log("MongoBD : connected ", conn.connections[0].host);
    } catch (error) {
        console.log("error checked Db", error);
        process.exit(1);
    }
};


module.exports = connectDB;

