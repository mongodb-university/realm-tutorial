package com.mongodb.tasktracker.model


enum class TaskStatus(val text: String, val code: Int) {
    OPEN("Open", 0),
    IN_PROGRESS("In Progress", 1),
    COMPLETE("Complete", 2)
}