//
//  Project.swift
//  Task Tracker
//
//  Created by MongoDB on 2020-05-07.
//  Copyright © 2020 MongoDB, Inc. All rights reserved.
//

import Foundation
import RealmSwift

typealias ProjectId = String

class Project: Object {
    @objc dynamic var _id = ObjectId.generate()
    @objc dynamic var _partition = ""
    @objc dynamic var name = ""
    override static func primaryKey() -> String? {
        return "_id"
    }
    
    convenience init(partition: String, name: String) {
        self.init()
        self._partition = partition
        self.name = name
    }
}

class User: Object {
    @objc dynamic var _id: ObjectId = ObjectId.generate()
    @objc dynamic var _partition: String = ""
    @objc dynamic var image: String? = nil
    @objc dynamic var name: String = ""
    @objc dynamic var user_id: String = ""
    override static func primaryKey() -> String? {
        return "_id"
    }
}

enum TaskStatus: String {
  case Open
  case InProgress
  case Complete
}

class Task: Object {
    @objc dynamic var _id: ObjectId = ObjectId.generate()
    @objc dynamic var _partition: ProjectId = ""
    @objc dynamic var assignee: User?
    @objc dynamic var name = ""
    @objc dynamic var status = TaskStatus.Open.rawValue

    var statusEnum: TaskStatus {
        get {
            return TaskStatus(rawValue: status) ?? .Open
        }
        set {
            status = newValue.rawValue
        }
    }

    override static func primaryKey() -> String? {
        return "_id"
    }
    
    convenience init(partition: String, name: String) {
        self.init()
        self._partition = partition
        self.name = name
    }
}
