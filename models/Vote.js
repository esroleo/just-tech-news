const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Will hold the user_id and post_id
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user', // what table is coming from
            key: 'id' // what column is going to be used
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id'
        }
    }
  
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'vote' // table name
  }
);

module.exports = Vote;