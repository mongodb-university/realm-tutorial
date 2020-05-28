package com.mongodb.tasktracker

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import io.realm.Realm
import io.realm.RealmUser
import io.realm.SyncConfiguration
import com.mongodb.tasktracker.model.ListAdapter
import com.mongodb.tasktracker.model.Task
import io.realm.kotlin.where
import io.realm.log.RealmLog
import io.realm.examples.objectserver.R

/*
 * TaskActivity: allows a user to view a collection of Tasks, edit the status of those tasks,
 * create new tasks, and delete existing tasks from the collection. All tasks are stored in a realm
 * and synced across devices using the partition "My Project", which is shared by all users.
 */
class TaskActivity : AppCompatActivity() {
    private lateinit var realm: Realm
    private var user: RealmUser? = null
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ListAdapter
    private lateinit var fab: FloatingActionButton

    override fun onStart() {
        super.onStart()
        try {
            user = taskApp.currentUser()
        } catch (e: IllegalStateException) {
            RealmLog.warn(e)
        }
        if (user == null) {
            // if no user is currently logged in, start the login activity so the user can authenticate
            startActivity(Intent(this, LoginActivity::class.java))
        }
        else {
            // configure realm to use the current user and the partition corresponding to "My Project"
            val config = SyncConfiguration.Builder(user!!, "My Project")
                    .waitForInitialRemoteData()
                    .build()

            // save this configuration as the default for this entire app so other activities and threads can open their own realm instances
            Realm.setDefaultConfiguration(config)

            // Sync all realm changes via a new instance, and when that instance has been successfully created connect it to an on-screen list (a recycler view)
            Realm.getInstanceAsync(config, object: Realm.Callback() {
                override fun onSuccess(realm: Realm) {
                    // since this realm should live exactly as long as this activity, assign the realm to a member variable
                    this@TaskActivity.realm = realm
                    setUpRecyclerView(realm)
                }
            })
        }
    }

    override fun onStop() {
        super.onStop()
        user.run {
            realm.close()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_task)

        // default instance uses the configuration created in the login activity
        realm = Realm.getDefaultInstance()
        recyclerView = findViewById(R.id.task_list)
        fab = findViewById(R.id.floating_action_button)

        // create a dialog to enter a task name when the floating action button is clicked
        fab.setOnClickListener {
            val input = EditText(this)
            val dialogBuilder = AlertDialog.Builder(this)
            dialogBuilder.setMessage("Enter task name:")
                    .setCancelable(true)
                    .setPositiveButton("Create") { dialog, _ -> run {
                        dialog.dismiss()
                        val task = Task(input.text.toString())
                        // all realm writes need to occur inside of a transaction
                        realm.executeTransactionAsync { realm ->
                            realm.insert(task)
                        }
                    }
                    }
                    .setNegativeButton("Cancel") { dialog, _ -> dialog.cancel()
                    }

            val dialog = dialogBuilder.create()
            dialog.setView(input)
            dialog.setTitle("Create New Task")
            dialog.show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        recyclerView.adapter = null
        // if a user hasn't logged out when we close the realm, still need to explicitly close
        realm.close()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.activity_task_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_logout -> {
                user?.logOutAsync {
                    if (it.isSuccess) {
                        // always close the realm when finished interacting to free up resources
                        realm.close()
                        user = null
                        Log.v(TAG(), "user logged out")
                        startActivity(Intent(this, LoginActivity::class.java))
                    } else {
                        RealmLog.error(it.error.toString())
                        Log.e(TAG(), "log out failed! Error: ${it.error}")
                    }
                }
                true
            }
            else -> {
                super.onOptionsItemSelected(item)
            }
        }
    }

    private fun setUpRecyclerView(realm: Realm) {
        // a recyclerview requires an adapter, which feeds it items to display.
        // Realm provides RealmRecyclerViewAdapter, which you can extend to customize for your application
        // pass the adapter a collection of Tasks from the realm
        // we sort this collection so that the displayed order of Tasks remains stable across updates
        adapter = ListAdapter(realm.where<Task>().sort("_id").findAll())
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter
        recyclerView.setHasFixedSize(true)
        recyclerView.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
    }
}
