package com.mongodb.tasktracker.model

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import io.realm.annotations.Required
import org.bson.types.ObjectId

enum class TaskStatus(val displayName: String) {
    Open("Open"),
    InProgress("In Progress"),
    Complete("Complete"),
}

open class Task(_name: String = "Task", project: String = "My Project") : RealmObject() {
    @PrimaryKey var _id: ObjectId = ObjectId()
    var _partition: String = project
    var name: String = _name
    @Required
    private var status: String = TaskStatus.Open.name
    var statusEnum: TaskStatus
        get() { return TaskStatus.valueOf(status) }
        set(value) { status = value.name }
}
