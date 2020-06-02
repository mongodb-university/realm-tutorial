package com.mongodb.tasktracker

import android.app.Application
import android.util.Log

import io.realm.Realm
import io.realm.RealmApp
import io.realm.RealmAppConfiguration
import io.realm.log.LogLevel
import io.realm.log.RealmLog

lateinit var taskApp: RealmApp

// global Kotlin extension that resolves to the short version
// of the name of the current class. Used for labelling logs.
inline fun <reified T> T.TAG(): String = T::class.java.simpleName

/*
* TaskTracker: Sets up the taskApp Realm App and enables Realm-specific logging in debug mode.
*/
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

        Log.v(TAG(), "Initialized the Realm App configuration for: ${taskApp.configuration.appId}")
    }
}