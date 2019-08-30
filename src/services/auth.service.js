import * as secure from '../utils/secure';
import _ from 'lodash';
import * as jwt from 'jsonwebtoken';

export default class AuthService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async login(email, password) {
    const userRecord = await this.userRepo.findByEmail(email);
    if (!userRecord) {
      throw new Error('Invalid email or password.');
    }

    const validPassword = await secure.verifyPassword(userRecord.password, password);
    if (!validPassword) {
      throw new Error('Invalid email or password.');
    }

    return this.generateJWT(userRecord);
  }

  async signUp(email, password) {
    let userRecord = await this.userRepo.findByEmail(email);
    if (userRecord) {
      throw new Error('User already registered.');
    }
    
    const userData = {
      email: email,
      password: await secure.hashPassword(password),
    };
    
    userRecord = await this.userRepo.store(userData);
    
    const token = this.generateJWT(userRecord);

    return { token, userRecord };
  }

  generateJWT(user) {
    const payload = {
      email: user.email,
      uuid: user.uuid,
    };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRESIN 
    });
  
    return token;
  }
}