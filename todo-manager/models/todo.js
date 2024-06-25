'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      // define association here
    }
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    // markAsCompleted() {
    //   return this.update({ completed: true });
    // }
    deletetodo() {
      return this.destroy();
    }

    setCompletionStatus(bool) {
      return this.update({ completed: bool });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }
    static async overdue() {
      //select * from Todo where todays date>overdue
      try {
        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(),
            },
            completed: false,
          },
        });
      } catch (error) {
        console.log(error);
      }
      // FILL IN HERE TO RETURN OVERDUE ITEMS
    }

    static async dueToday() {
      //select * from Todo where todsya date is equal to dueDate

      try {
        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.eq]: new Date(),
            },
            completed: false,
          },
        });
      } catch (error) {
        console.log(error);
      }
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
    }

    static async dueLater() {
      try {
        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
            completed: false,
          },
        });
      } catch (error) {
        console.log(error);
      }
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async completedTodos() {
      try {
        return await Todo.findAll({
          where: {
            completed: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Todo',
    }
  );
  return Todo;
};
