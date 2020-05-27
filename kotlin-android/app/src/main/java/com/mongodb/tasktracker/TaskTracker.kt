package com.mongodb.tasktracker

import android.app.Application

import io.realm.Realm
import io.realm.RealmApp
import io.realm.RealmAppConfiguration
import io.realm.examples.objectserver.BuildConfig
import io.realm.log.LogLevel
import io.realm.log.RealmLog

lateinit var taskApp: RealmApp

inline fun <reified T> T.TAG(): String = T::class.java.simpleName

class TaskTracker : Application() {

    override fun onCreate() {
        super.onCreate()
        Realm.init(this)
        taskApp = RealmApp(RealmAppConfiguration.Builder(BuildConfig.MONGODB_REALM_APP_ID)
                .baseUrl(BuildConfig.MONGODB_REALM_URL)
                .appName(BuildConfig.VERSION_NAME)
                .appVersion(BuildConfig.VERSION_CODE.toString())
                .build())

        // Enable more logging in debug mode
        if (BuildConfig.DEBUG) {
            RealmLog.setLevel(LogLevel.ALL)
        }
    }
}
