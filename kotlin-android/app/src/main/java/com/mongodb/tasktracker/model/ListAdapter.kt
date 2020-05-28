package com.mongodb.tasktracker.model

import android.util.Log
import android.view.*
import android.widget.PopupMenu
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.mongodb.tasktracker.TAG
import io.realm.OrderedRealmCollection
import io.realm.Realm
import io.realm.RealmRecyclerViewAdapter
import io.realm.examples.objectserver.R
import io.realm.kotlin.where
import org.bson.types.ObjectId

/*
 * ListAdapter: extends the Realm-provided RealmRecyclerViewAdapter to provide data for a RecyclerView to display
 * Realm objects on screen to a user.
 */
internal class ListAdapter(data: OrderedRealmCollection<Task>) : RealmRecyclerViewAdapter<Task, ListAdapter.MyViewHolder?>(data, true) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val itemView: View = LayoutInflater.from(parent.context).inflate(R.layout.task_view, parent, false)
        return MyViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val obj: Task? = getItem(position)
        holder.data = obj
        holder.name.text = obj?.name
        holder.status.text = obj?.status

        // multiselect popup to control status
        holder.itemView.setOnClickListener {
            run {
                val popup = PopupMenu(holder.itemView.context, holder.menu)
                val menu = popup.menu

                // the menu should only contain statuses different from the current status
                if (holder.data?.status != TaskStatus.OPEN.text) {
                    menu.add(0, TaskStatus.OPEN.code, Menu.NONE, TaskStatus.OPEN.text)
                }
                if (holder.data?.status != TaskStatus.IN_PROGRESS.text) {
                    menu.add(0, TaskStatus.IN_PROGRESS.code, Menu.NONE, TaskStatus.IN_PROGRESS.text)
                }
                if (holder.data?.status != TaskStatus.COMPLETE.text) {
                    menu.add(0, TaskStatus.COMPLETE.code, Menu.NONE, TaskStatus.COMPLETE.text)
                }

                // add a delete button to the menu, identified by the delete code
                val deleteCode = -1
                menu.add(0, deleteCode, Menu.NONE, "Delete Task")

                // handle clicks for each button based on the code the button passes the listener
                popup.setOnMenuItemClickListener { item: MenuItem? ->
                    var status: String? = null
                    when (item!!.itemId) {
                        TaskStatus.OPEN.code -> {
                            status = TaskStatus.OPEN.text
                        }
                        TaskStatus.IN_PROGRESS.code -> {
                            status = TaskStatus.IN_PROGRESS.text
                        }
                        TaskStatus.COMPLETE.code -> {
                            status = TaskStatus.COMPLETE.text
                        }
                        deleteCode -> {
                            removeAt(holder.data?._id!!)
                        }
                    }

                    // if the status variable has a new value, update the status of the task in realm
                    if (status != null) {
                        Log.v(TAG(), "Changing status of ${holder.data?.name} (${holder.data?._id}) to $status")
                        changeStatus(status, holder.data?._id)
                    }
                    true
            }
            popup.show()
        }}
    }


    private fun changeStatus(_status: String, _id: ObjectId?) {
        // need to create a separate instance of realm to issue an update, since this event is
        // handled by a background thread and realm instances cannot be shared across threads
        val bgRealm = Realm.getDefaultInstance()
        // execute Transaction (not async) because changeStatus should execute on a background thread
        bgRealm!!.executeTransaction {
            // using our thread-local new realm instance, query for and update the task status
            val item = it.where<Task>().equalTo("_id", _id).findFirst()
            item?.status = _status
        }
        // always close realms when you are done with them!
        bgRealm.close()
    }

    private fun removeAt(id: ObjectId) {
        // need to create a separate instance of realm to issue an update, since this event is
        // handled by a background thread and realm instances cannot be shared across threads
        val bgRealm = Realm.getDefaultInstance()
        // execute Transaction (not async) because remoteAt should execute on a background thread
        bgRealm!!.executeTransaction {
            // using our thread-local new realm instance, query for and delete the task
            val item = it.where<Task>().equalTo("_id", id).findFirst()
            item?.deleteFromRealm()
        }
        // always close realms when you are done with them!
        bgRealm.close()
    }

    internal inner class MyViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var name: TextView = view.findViewById(R.id.name)
        var status: TextView = view.findViewById(R.id.status)
        var data: Task? = null
        var menu: TextView = view.findViewById(R.id.menu)

    }
}
