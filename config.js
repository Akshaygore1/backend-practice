import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGODB_URI);
export default {
	MONGODB_URI: process.env.MONGODB_URI,
	PORT: process.env.PORT,
};
