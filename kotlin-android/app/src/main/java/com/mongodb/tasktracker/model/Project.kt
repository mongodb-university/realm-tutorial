package com.mongodb.tasktracker.model

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.bson.types.ObjectId


open class Project(user_id: String = "user", _name: String = "My Project") : RealmObject() {
        @PrimaryKey var _id: ObjectId = ObjectId()
        var _partition: String = user_id
        var name: String = _name
}
