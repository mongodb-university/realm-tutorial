package com.mongodb.tasktracker

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import io.realm.RealmCredentials
import io.realm.examples.objectserver.R
import io.realm.examples.objectserver.databinding.ActivityLoginBinding
import io.realm.log.RealmLog

/*
 * LoginActivity: Uses credentials provided by a user to create and log into a user account.
 */
class LoginActivity : AppCompatActivity() {

    private lateinit var username: EditText
    private lateinit var password: EditText
    private lateinit var loginButton: Button
    private lateinit var createUserButton: Button

    private lateinit var binding: ActivityLoginBinding

    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_login)
        username = binding.inputUsername
        password = binding.inputPassword
        loginButton = binding.buttonLogin
        createUserButton = binding.buttonCreate

        loginButton.setOnClickListener { login(false) }
        createUserButton.setOnClickListener { login(true) }
    }

    // handle user authentication (login) and account creation
    private fun login(createUser: Boolean) {
        if (!validateCredentials()) {
            onLoginFailed("Invalid username or password")
            return
        }

        // while this operation completes, disable the buttons to login or create a new account
        binding.buttonCreate.isEnabled = false
        binding.buttonLogin.isEnabled = false

        val username = this.username.text.toString()
        val password = this.password.text.toString()


        if (createUser) {
            // register a user using the Realm App we created in the TaskTracker class
            taskApp.emailPasswordAuth.registerUserAsync(username, password) {
                // re-enable the buttons after user registration completes
                binding.buttonCreate.isEnabled = true
                binding.buttonLogin.isEnabled = true
                if (!it.isSuccess) {
                    onLoginFailed("Could not register user.")
                    Log.v(TAG(), "Error: ${it.error}")
                } else {
                    Log.v(TAG(), "Successfully registered user.")
                    // when the account has been created successfully, log in to the account
                    login(false)
                }
            }
        } else {
            val creds = RealmCredentials.emailPassword(username, password)
            taskApp.loginAsync(creds) {
                // re-enable the buttons after
                loginButton.isEnabled = true
                createUserButton.isEnabled = true
                if (!it.isSuccess) {
                    RealmLog.error(it.error.toString())
                    onLoginFailed(it.error.message ?: "An error occurred.")
                } else {
                    onLoginSuccess()
                }
            }
        }
    }

    override fun onBackPressed() {
        // Disable going back to the MainActivity
        moveTaskToBack(true)
    }

    private fun onLoginSuccess() {
        // successful login ends this activity, bringing the user back to the task activity
        finish()
    }

    private fun onLoginFailed(errorMsg: String) {
        Log.v(TAG(), errorMsg)
        Toast.makeText(baseContext, errorMsg, Toast.LENGTH_LONG).show()
    }

    private fun validateCredentials(): Boolean = when {
        // zero-length usernames and passwords are not valid (or secure), so prevent users from creating accounts with those client-side.
        username.text.toString().isEmpty() -> false
        password.text.toString().isEmpty() -> false
        else -> true
    }
}
