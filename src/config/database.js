const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://BhushanKumar:SigjzcBwa17QQda8@nodejs.7vqir.mongodb.net/devTinder"
  );
};
module.exports = { connectDB };
