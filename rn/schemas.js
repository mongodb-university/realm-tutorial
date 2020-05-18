import {ObjectId} from 'bson';

class Task {
  /**
   *
   * @param {string} name The name of the task
   * @param {string status The status of the task. Default value is "Open"
   * @param {ObjectId} id The ObjectId to create this task with
   */
  constructor({
    name,
    partition,
    status = Task.STATUS_OPEN,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.name = name;
    this.status = status;
  }

  STATUS_OPEN = 'Open';
  STATUS_CLOSED = 'Closed';
  static schema = {
    name: 'Task',
    properties: {
      _id: 'object id',
      _partition: 'string',
      name: 'string?',
      status: 'string',
    },
    primaryKey: '_id',
  };
}

export {Task};
