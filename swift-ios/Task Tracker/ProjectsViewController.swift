//
//  ProjectsViewController.swift
//
//
//  Created by MongoDB on 2020-05-04.
//

import Foundation
import UIKit
import RealmSwift

class ProjectsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    let tableView = UITableView()
    let userRealm: Realm
    var notificationToken: NotificationToken?
    var userData: User?

    init(userRealm: Realm) {
        self.userRealm = userRealm

        super.init(nibName: nil, bundle: nil)

        // There should only be one user in my realm - that is myself
        let usersInRealm = userRealm.objects(User.self)

        notificationToken = usersInRealm.observe { [weak self, usersInRealm] (changes) in
            self?.userData = usersInRealm.first
            guard let tableView = self?.tableView else { return }
            tableView.reloadData()
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    deinit {
        // Always invalidate any notification tokens when you are done with them.
        notificationToken?.invalidate()
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Configure the view.
        title = "Projects"
        tableView.dataSource = self
        tableView.delegate = self
        tableView.frame = self.view.frame
        view.addSubview(tableView)

        // On the top left is a log out button.
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Log Out", style: .plain, target: self, action: #selector(logOutButtonDidClick))
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // You always have at least one project (your own) plus any projects you are a member of
        return 1 + (userData?.memberOf.count ?? 0)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell") ?? UITableViewCell(style: .default, reuseIdentifier: "Cell")
        cell.selectionStyle = .none

        if (indexPath.row == 0) {
            // First in list is always your own project
            cell.textLabel?.text = "My Project"
            return cell;
        }

        // List is offset by 1 to make room for your project
        let row = indexPath.row - 1
        let project = userData!.memberOf[row]

        cell.textLabel?.text = "\(project.name!)'s Project"
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let user = app.currentUser() else {
            print("Error: logged out?")
            return;
        }

        let project = indexPath.row == 0
            ? Project(partition: "project=\(user.identity!)", name: "My Project") 
            : userData?.memberOf[indexPath.row - 1]

        Realm.asyncOpen(
            configuration: user.configuration(partitionValue: project!.partition!),
            callback: { [weak self] (realm, error) in
                guard error == nil else {
                    fatalError("Failed to open realm: \(error!)")
                }
                let projectName = project?.name ?? "Unknown"
                
                // For the second phase of the tutorial, go to the Projects management page.
                // This is where you can manage permissions and collaborators.
                self?.navigationController?.pushViewController(TasksViewController(realm: realm!, title: "\(projectName)'s Tasks"), animated: true);

            })
    }

    @objc func logOutButtonDidClick() {
        let alertController = UIAlertController(title: "Log Out", message: "", preferredStyle: .alert);
        alertController.addAction(UIAlertAction(title: "Yes, Log Out", style: .destructive, handler: {
            alert -> Void in
            print("Logging out...");
            app.logOut(completion: { (error) in
                DispatchQueue.main.sync {
                    print("Logged out!");
                    self.navigationController?.setViewControllers([WelcomeViewController()], animated: true)
                }
            })
        }))
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        self.present(alertController, animated: true, completion: nil)
    }
}
