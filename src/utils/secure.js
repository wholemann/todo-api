import bcrypt from 'bcrypt';

const verifyPassword = async (originPwd, targetPwd) => {
  return await bcrypt.compare(targetPwd, originPwd);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export {
  verifyPassword,
  hashPassword,
}