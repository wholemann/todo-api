import bcrypt from 'bcrypt';
import { uuid } from '../utils/uuid';
import Joi from '@hapi/joi';


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      allowNull: false,
      unique: true,
      type: 'BINARY(16)',
      defaultValue() {
        return Buffer.from(uuid(), 'hex');
      },
      get() {
        return Buffer.from(this.getDataValue('uuid')).toString('hex');
      },
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = function (models) {
    // associations
  };

  // hooks
  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.validate = (user) => {
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    };

    return Joi.validate(user, schema);
  }

  return User;
};
