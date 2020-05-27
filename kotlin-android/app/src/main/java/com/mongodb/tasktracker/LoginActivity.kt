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

    private fun login(createUser: Boolean) {
        if (!validateCredentials()) {
            onLoginFailed("Invalid username or password")
            return
        }

        binding.buttonCreate.isEnabled = false
        binding.buttonLogin.isEnabled = false

        val username = this.username.text.toString()
        val password = this.password.text.toString()


        if (createUser) {
            taskApp.emailPasswordAuth.registerUserAsync(username, password) {
                binding.buttonCreate.isEnabled = true
                binding.buttonLogin.isEnabled = true
                if (!it.isSuccess) {
                    onLoginFailed("Could not register user.")
                    Log.v(TAG(), "Error: ${it.error}")
                } else {
                    Log.v(TAG(), "Successfully registered user.")
                    login(false)
                }
            }
        } else {
            val creds = RealmCredentials.emailPassword(username, password)
            taskApp.loginAsync(creds) {
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
        loginButton.isEnabled = true
        createUserButton.isEnabled = true
        finish()
    }

    private fun onLoginFailed(errorMsg: String) {
        Log.v(TAG(), errorMsg)
        loginButton.isEnabled = true
        createUserButton.isEnabled = true
        Toast.makeText(baseContext, errorMsg, Toast.LENGTH_LONG).show()
    }

    private fun validateCredentials(): Boolean = when {
        username.text.toString().isEmpty() -> false
        password.text.toString().isEmpty() -> false
        else -> true
    }
}
