import mongoose from 'mongoose';

const dbConnection = async () => {
    try {
        await mongoose.connect(String(process.env.DB_CNN), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error connecting to DB');
    }
}

export default dbConnection;