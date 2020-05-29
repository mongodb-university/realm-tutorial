package com.mongodb.tasktracker.model

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.bson.types.ObjectId

enum class TaskStatus(val text: String, val code: Int) {
    OPEN("Open", 0),
    IN_PROGRESS("In Progress", 1),
    COMPLETE("Complete", 2)
}

open class Task(_name: String = "Task", project: String = "My Project") : RealmObject() {
    @PrimaryKey var _id: ObjectId = ObjectId()
    var _partition: String = project
    var name: String = _name
    var status: String = TaskStatus.OPEN.text

}
