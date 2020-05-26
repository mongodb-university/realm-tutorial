/*
 * Copyright 2019 Realm Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.realm.examples.objectserver

import android.app.AlertDialog
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import io.realm.Realm
import io.realm.RealmResults
import io.realm.RealmUser
import io.realm.SyncConfiguration
import io.realm.examples.objectserver.model.ListAdapter
import io.realm.examples.objectserver.model.Project
import io.realm.examples.objectserver.model.SwipeToDeleteCallback
import io.realm.examples.objectserver.model.Task
import io.realm.kotlin.syncSession
import io.realm.kotlin.where
import io.realm.log.RealmLog


class TaskActivity : AppCompatActivity() {
    private var realm: Realm? = null
    private var recyclerView: RecyclerView? = null
    private var adapter: ListAdapter? = null
    private var user: RealmUser? = null
    private var fab: FloatingActionButton? = null


    private val loggedInUser: RealmUser?
        get() {
            var user: RealmUser? = null

            try {
                user = APP.currentUser()
            } catch (e: IllegalStateException) {
                RealmLog.warn(e);
            }

            if (user == null) {
                // send user to login if not logged in
                startActivity(Intent(this, LoginActivity::class.java))
            }

            return user
        }

    override fun onStart() {
        super.onStart()
        user = loggedInUser
        val user = user
        if (user != null) {
            val config = SyncConfiguration.Builder(user, user.id)
                    .waitForInitialRemoteData()
                    .build()
            Realm.setDefaultConfiguration(config)

            // This will automatically sync all changes in the background for as long as the Realm is open
            Realm.getInstanceAsync(config, object: Realm.Callback() {
                override fun onSuccess(realm: Realm) {
                    this@TaskActivity.realm = realm
                    setUpRecyclerView(realm)
                }
            })
        }
    }

    override fun onStop() {
        super.onStop()
        user?.run {
            realm?.close()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_task)
        realm = Realm.getDefaultInstance()
        recyclerView = findViewById(R.id.task_list)
        fab = findViewById(R.id.floating_action_button)

        // create a dialog to enter a task name when the floating action button is clicked
        fab?.setOnClickListener {
            val input = EditText(this)
            val dialogBuilder = AlertDialog.Builder(this)
            dialogBuilder.setMessage("Enter task name:")
                    .setCancelable(true)
                    .setPositiveButton("Create", DialogInterface.OnClickListener {
                        dialog, _ -> run {
                            dialog.dismiss()
                            val task = Task(user!!.id, input.text.toString())
                            realm!!.executeTransactionAsync { realm ->
                                realm.insert(task)
                            }
                        }
                    })
                    .setNegativeButton("Cancel", DialogInterface.OnClickListener {
                        dialog, _ -> dialog.cancel()
                    })

            val dialog = dialogBuilder.create()
            dialog.setView(input)
            dialog.setTitle("Create New Task")
            dialog.show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        recyclerView!!.adapter = null
        realm!!.close()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.activity_task_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_logout -> {
                val user = user
                user?.logOutAsync {
                    if (it.isSuccess) {
                        realm?.close()
                        this.user = loggedInUser
                    } else {
                        RealmLog.error(it.error.toString())
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
        // sorting the list by a unique property ensures a consistent display order
        adapter = ListAdapter(realm.where<Task>().sort("_id").findAll())
        recyclerView!!.layoutManager = LinearLayoutManager(this)
        recyclerView!!.adapter = adapter
        recyclerView!!.setHasFixedSize(true)
        recyclerView!!.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))

        // swipe to left to delete
        val swipeHandler = object : SwipeToDeleteCallback(this) {
            override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
                val adapter = recyclerView?.adapter as ListAdapter
                adapter.removeAt(adapter.getId(viewHolder.adapterPosition))
            }
        }
        val itemTouchHelper = ItemTouchHelper(swipeHandler)
        itemTouchHelper.attachToRecyclerView(recyclerView)
    }
}
