//
//  AppDelegate.swift
//  Task Tracker
//
//  Created by MongoDB on 2020-04-30.
//  Copyright © 2020 MongoDB, Inc. All rights reserved.
//

import UIKit
import RealmSwift

struct Constants {
    // Set this to your Realm App ID found in the Realm UI.
    static let REALM_APP_ID = "myrealmapp-vjmee"
    
    // The base URL points to the server hosting MongoDB Realm.
    static let REALM_BASE_URL = "https://realm-dev.mongodb.com"
}

let app = RealmApp(Constants.REALM_APP_ID, configuration: AppConfiguration(baseURL: Constants.REALM_BASE_URL,
    transport: nil,
    localAppName: nil,
    localAppVersion: nil))

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.

        window = UIWindow(frame: UIScreen.main.bounds)
        window?.makeKeyAndVisible()
        window?.rootViewController = UINavigationController(rootViewController: WelcomeViewController())

        return true
    }

}

