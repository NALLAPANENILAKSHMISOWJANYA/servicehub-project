import mongoose from 'mongoose';

const uri = 'mongodb://lakshmisowjanya2005_db_user:5fZ10HDzmfXLrq8K@ac-lhauqrq-shard-00-00.iatx4sg.mongodb.net:27017,ac-lhauqrq-shard-00-01.iatx4sg.mongodb.net:27017,ac-lhauqrq-shard-00-02.iatx4sg.mongodb.net:27017/serviceBooking?ssl=true&replicaSet=atlas-lhauqrq-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
