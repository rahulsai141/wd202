// 'use strict';
// const { Model } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static async addTask(params) {
//       return await Todo.create(params);
//     }
//     static associate(models) {
//       // define association here
//     }
//     displayableString() {
//       let checkbox = this.completed ? '[x]' : '[ ]';
//       return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
//     }
//   }
//   Todo.init(
//     {
//       title: DataTypes.STRING,
//       dueDate: DataTypes.DATEONLY,
//       completed: DataTypes.BOOLEAN,
//     },
//     {
//       sequelize,
//       modelName: 'Todo',
//     }
//   );
//   return Todo;
// };

'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log('My Todo list \n');

      console.log('Overdue');

      const overdueTodos = await Todo.overdue();
      console.log(
        overdueTodos.map(todo => todo.displayableString()).join('\n')
      );

      // FILL IN HERE
      console.log('\n');

      console.log('Due Today');
      const dueTodayTodos = await Todo.dueToday();
      console.log(
        dueTodayTodos.map(todo => todo.displayableString()).join('\n')
      );

      // FILL IN HERE
      console.log('\n');

      console.log('Due Later');
      const dueLaterTodos = await Todo.dueLater();
      console.log(
        dueLaterTodos.map(todo => todo.displayableString()).join('\n')
      );
      // FILL IN HERE
    }

    static async overdue() {
      //select * from Todo where todays date>overdue
      try {
        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(),
            },
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
          },
        });
      } catch (error) {
        console.log(error);
      }
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async deleteTodoItem(id) {
      try {
        const deleteitem = await Todo.destroy({
          where: {
            id: id,
          },
        });
        console.log(`Deleted row count Item ${deleteitem}`);
      } catch (error) {
        console.log(error);
      }
    }

    static async markAsComplete(id) {
      try {
        return await Todo.update(
          {
            completed: true,
          },
          {
            where: {
              completed: false,
              id: id,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
    }

    displayableString() {
      let checkbox = this.completed ? '[x]' : '[ ]';
      let dateString =
        this.dueDate !== new Date().toLocaleDateString('en-CA')
          ? this.dueDate
          : '';
      return `${this.id}. ${checkbox} ${this.title} ${dateString}`.trim();
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
