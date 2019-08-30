import UserRepo from '../../../repositories/user.repository';
import AuthService from '../../../services/auth.service';
import * as secure from '../../../utils/secure';
import * as jwt from 'jsonwebtoken';

describe('auth service', () => {
  describe('user login', () => { 
    it('should return valid token', async () => {
      const userRepo = new UserRepo();
      userRepo.findByEmail = jest.fn().mockResolvedValue({
        email: 'test@test.com',
        password: jest.fn(),
      });

      secure.verifyPassword = jest.fn().mockResolvedValue(true);

      const authService = new AuthService(userRepo);
      const token = await authService.login('test@test.com', jest.fn());
      // expect(mock).toBeCalledTimes(1);
      expect(token).toBeDefined();
    });
  });

  describe('user signup', () => {
    it('should return token and user info', async () => {
      const userRepo = new UserRepo();
      userRepo.store = jest.fn().mockResolvedValue({
        email: 'test@test.com',
        password: jest.fn(),
      });

      // 이메일이 중복되는지 검사
      // 중복 throw Error
      // 이메일이 없으면
      // bcrypt로 패스워드 생성 후 db 저장
      
      userRepo.findOne = jest.fn().mockResolvedValue(undefined);
      secure.hashPassword = jest.fn().mockResolvedValue(jest.fn());

      const authService = new AuthService(userRepo);
      const { token, userRecord } = await authService.signUp('test@test.com', jest.fn());

      expect(token).toBeDefined();
      expect(userRecord.email).toEqual('test@test.com');

    });
  });
})