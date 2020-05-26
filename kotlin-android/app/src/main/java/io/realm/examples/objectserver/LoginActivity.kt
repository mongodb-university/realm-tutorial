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

import android.app.ProgressDialog
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import io.realm.RealmCredentials
import io.realm.examples.objectserver.databinding.ActivityLoginBinding
import io.realm.examples.objectserver.model.TAG
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
        if (!validate()) {
            onLoginFailed("Invalid username or password")
            return
        }

        binding.buttonCreate.isEnabled = false
        binding.buttonLogin.isEnabled = false

        val progressDialog = ProgressDialog(this@LoginActivity)
        progressDialog.isIndeterminate = true
        progressDialog.setMessage("Authenticating...")
        progressDialog.show()

        val username = this.username.text.toString()
        val password = this.password.text.toString()


        if (createUser) {
            APP.emailPasswordAuth.registerUserAsync(username, password) {
                progressDialog.dismiss()
                binding.buttonCreate.isEnabled = true
                binding.buttonLogin.isEnabled = true
                if (!it.isSuccess) {
                    Log.v(TAG(), "Failed to register user.")
                    onLoginFailed("Could not register user.")
                } else {
                    // hide the on-screen keyboard and prompt the user to log in
                    Log.v(TAG(), "Successfully registered user.")
                    val inputMethodManager = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                    inputMethodManager.hideSoftInputFromWindow(this.currentFocus?.windowToken, 0)
                    Toast.makeText(this, "Successfully created account. Try logging in!", Toast.LENGTH_LONG).show()
                }
            }
        } else {
            val creds = RealmCredentials.emailPassword(username, password)
            APP.loginAsync(creds) {
                progressDialog.dismiss()
                if (!it.isSuccess) {
                    RealmLog.error(it.error.toString())
                    onLoginFailed(it.error.message ?: "An error occurred.")
                    Log.v(TAG(), "Failed to login user.")
                } else {
                    Log.v(TAG(), "Successfully logged in user.")
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
        loginButton.isEnabled = true
        createUserButton.isEnabled = true
        Toast.makeText(baseContext, errorMsg, Toast.LENGTH_LONG).show()
    }

    private fun validate(): Boolean = when {
        username.text.toString().isEmpty() -> false
        password.text.toString().isEmpty() -> false
        else -> true
    }
}
