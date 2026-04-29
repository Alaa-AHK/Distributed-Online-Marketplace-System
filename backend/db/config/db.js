import mongoose from 'mongoose';

const connections = {
  userDB: mongoose.createConnection('mongodb://localhost:27017/userDB'),
  productDB: mongoose.createConnection('mongodb://localhost:27017/productDB'),
  paymentDB: mongoose.createConnection('mongodb://localhost:27017/paymentDB'),
  inventoryDB: mongoose.createConnection('mongodb://localhost:27017/inventoryDB'),
  chatDB: mongoose.createConnection('mongodb://localhost:27017/chatDB'),
  reportDB: mongoose.createConnection('mongodb://localhost:27017/reportDB'),
};

export const connectDatabases = async () => {
  try {
    await connections.userDB.asPromise();
    console.log('✅ userDB connected');

    await connections.productDB.asPromise();
    console.log('✅ productDB connected');

    await connections.paymentDB.asPromise();
    console.log('✅ paymentDB connected');

    await connections.inventoryDB.asPromise();
    console.log('✅ inventoryDB connected');

    await connections.chatDB.asPromise();
    console.log('✅ chatDB connected');

    await connections.reportDB.asPromise();
    console.log('✅ reportDB connected');

    console.log('\n🟢 All 6 distributed databases connected!');
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  }
};

export { connections };