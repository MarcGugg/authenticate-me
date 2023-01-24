'use strict';

const {
  Model
} = require('sequelize');
// const { User } = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    async avgRating() {
      const reviews = await this.getReviews()
      let starsArr = []
      
      for (let i = 0; i < reviews.length; i++) {
        starsArr.push(reviews[i].stars)
      }

      let sum = 0
      for (let i = 0; i < starsArr.length; i++) {
        sum += starsArr[i]
      }

      return sum / starsArr.length

    }
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {foreignKey: 'ownerId'})
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId', as: 'previewImage'})
      Spot.hasMany(models.Booking, {foreignKey: 'spotId'})
      Spot.hasMany(models.Review, {foreignKey: 'spotId'})
      Spot.belongsToMany(models.User, {
        through: 'Booking',
        otherKey: 'userId',
        foreignKey: 'spotId',
        as: 'user_from_booking'
      })
      Spot.belongsToMany(models.User, {
        through: 'Review',
        otherKey: 'userId',
        foreignKey: 'spotId',
        as: 'user_from_review'
      })
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      references: {model: 'Users', key: 'id'},
      allowNull: false,
      onDelete: 'CASCADE'
    },
    address: {
      type:DataTypes.STRING,
      allowNull: false
    },
    city: {
      type:DataTypes.STRING,
      allowNull: false
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false
    },
    country: {
      type:DataTypes.STRING,
      allowNull: false
    },
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};