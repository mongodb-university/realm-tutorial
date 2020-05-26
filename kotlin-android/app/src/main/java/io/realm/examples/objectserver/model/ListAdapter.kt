package io.realm.examples.objectserver.model

import android.util.Log
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.PopupMenu
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import io.realm.OrderedRealmCollection
import io.realm.Realm
import io.realm.RealmRecyclerViewAdapter
import io.realm.examples.objectserver.R
import io.realm.kotlin.where
import org.bson.types.ObjectId


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
        holder.itemView.setOnClickListener { item -> run {
            val popup = PopupMenu(holder.itemView.context, holder.menu)
            popup.inflate(R.menu.task_options_menu)
            popup.setOnMenuItemClickListener(PopupMenu.OnMenuItemClickListener { item: MenuItem? ->
                val status: String = when (item!!.itemId) {
                    R.id.menu1 -> {
                        TaskStatus.OPEN.text
                    }
                    R.id.menu2 -> {
                        TaskStatus.IN_PROGRESS.text
                    }
                    R.id.menu3 -> {
                        TaskStatus.COMPLETE.text
                    }
                    else -> {
                        Log.e(TAG(), "Unrecognized status selected!")
                        holder.data?.status!!
                    }
                }

                Log.v(TAG(), "Changing status of ${holder.data?.name} (${holder.data?._id}) to $status")
                changeStatus(status, holder.data?._id)
                true
            })
            popup.show()
        }}
    }


    fun changeStatus(_status: String, _id: ObjectId?) {
        // need to create a separate instance of realm to issue an update, since this event is
        // handled by a background thread and realm instances cannot be shared across threads
        val bgRealm = Realm.getDefaultInstance()
        bgRealm!!.executeTransactionAsync {
            val item = it.where<Task>().equalTo("_id", _id).findFirst()
            item?.status = _status
        }
    }

    fun removeAt(id: ObjectId) {
        // need to create a separate instance of realm to issue an update, since this event is
        // handled by a background thread and realm instances cannot be shared across threads
        val bgRealm = Realm.getDefaultInstance()
        bgRealm!!.executeTransactionAsync {
            val item = it.where<Task>().equalTo("_id", id).findFirst()
            item?.deleteFromRealm();
        }
    }

    fun getId(position: Int): ObjectId {
        return data!![position]._id
    }

    internal inner class MyViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        var name: TextView
        var status: TextView
        var data: Task? = null
        var menu: TextView

        init {
            name = view.findViewById(R.id.name)
            status = view.findViewById(R.id.status)
            menu = view.findViewById(R.id.menu)
        }
    }
}
