# Deployment Guide: Taking Your SailWell App Live

This guide provides a detailed, step-by-step process for deploying your Next.js application to the web using **Firebase App Hosting**. Following these steps will give you a live, publicly accessible URL for your application, and a separate development URL for testing.

## Prerequisites

Before you begin, ensure you have the following installed and set up:

1.  **Node.js**: This is required to run your Next.js app and install packages. You can download it from [nodejs.org](https://nodejs.org/).
2.  **A Firebase Account**: If you don't have one, you can create one for free at [firebase.google.com](https://firebase.google.com/).
3.  **Firebase CLI**: This is the command-line tool for managing and deploying Firebase projects. Install it globally on your machine by running this command in your terminal:
    ```bash
    npm install -g firebase-tools
    ```

---

## Step 1: Set Up Your Project Locally

First, you need to have the application code on your local computer.

1.  **Download the Code**: Download the entire project from this development environment to your local machine.
2.  **Open in Terminal**: Navigate into the root directory of the project in your terminal.
3.  **Install Dependencies**: Run the following command to install all the necessary packages for the application:
    ```bash
    npm install
    ```

## Step 2: Set Up Your Git Repository and Connect to GitHub

Using Git is crucial for managing your `dev` and `live` environments.

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of SailWell application"
    ```
2.  **Connect to GitHub**: 
    - Create a new, empty repository on GitHub.
    - Link your local project to it. Replace `<your-github-repo-url>` with the URL provided by GitHub.
    ```bash
    git remote add origin <your-github-repo-url>
    git push -u origin main
    ```

---

## Step 3: Connect Your Project to Firebase

Now, you'll link your local project to a Firebase project and configure automated deployments.

1.  **Log in to Firebase**: In your terminal, run:
    ```bash
    firebase login
    ```
    This will open a browser window for you to log in and grant permissions.

2.  **Create a Firebase Project**:
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click **"Add project"** and give it a name (e.g., "sailwell-app").
    *   Follow the on-screen steps. You can disable Google Analytics if you wish.

3.  **Initialize Firebase in Your App**:
    *   Back in your terminal, at the root of your project, run:
        ```bash
        firebase init
        ```
    *   This will start an interactive setup process. Here’s how to answer the questions:

        > **Which Firebase features do you want to set up?**
        >
        > Use the arrow keys and spacebar to select **"App Hosting: Manage and deploy Next.js web apps to Firebase."** then press Enter.

        > **Please select an option:**
        >
        > Choose **"Use an existing project"**.

        > **Select a default Firebase project:**
        >
        > Select the Firebase project you just created (e.g., `sailwell-app`).

        > **What is the name of your web app's backend?**
        >
        > Press Enter to accept the default (e.g., `sailwell-backend`).

        > **In which region would you like to host your backend?**
        >
        > Select a region that is geographically close to your target users (e.g., `us-central1`).

        > **Set up automatic builds and deploys with GitHub?**
        >
        > Select **Yes**. This is the key to automating your `dev` and `live` environments. The CLI will guide you through authenticating with your GitHub account.

        > **For which GitHub repository would you like to set up a GitHub workflow?**
        >
        > Enter your repository name in the format `your-username/your-repo-name`.

        > **Which script should run before every deploy?**
        >
        > You can leave this blank and press Enter.

        > **Do you want to deploy your live branch on every push?**
        >
        > Select **Yes**. This configures the GitHub Action to deploy to your live URL whenever you push to your `main` branch.

        > **What is the name of your live branch?**
        >
        > Enter `main` (or `master`, depending on your repository's default).

This process creates a `firebase.json` file, a `.firebaserc` file, and a `.github/workflows` directory. These files configure your deployments.

4.  **Commit and Push the Firebase Configuration**:
    ```bash
    git add firebase.json .firebaserc .github/
    git commit -m "Configure Firebase App Hosting and GitHub Actions"
    git push
    ```

---

## Step 4: The First Deployment (Live)

Your project is now fully configured. Because you just pushed the new GitHub workflow file to your `main` branch, your first **live** deployment has already started automatically!

1.  **Check the Deployment**:
    *   Go to your repository on GitHub and click the **"Actions"** tab.
    *   You will see a workflow running. Once it completes, your site will be live.
2.  **Get Your Live URL**:
    *   In the Firebase Console, navigate to the **"App Hosting"** section of your project.
    *   You will see your main backend listed with its live URL. It will look something like this:

    ✅ **Live URL: https://sailwell-app-xxxx.web.app**

This is the public link to your production application.

---

## Step 5: Managing Your `dev` and `live` Environments

The GitHub Action you configured is the key to managing separate environments. It automatically creates different public deployments based on your Git branches.

### The `live` Environment

*   **Branch**: `main` (or your specified live branch).
*   **Trigger**: Any time you `git push` or merge code into the `main` branch.
*   **URL**: Your main production URL (e.g., `https://sailwell-app-xxxx.web.app`).
*   **Purpose**: This is your stable, production environment for end-users.

### The `dev` Environment (Preview Channel)

Firebase App Hosting automatically creates persistent "Preview Channels" for your other branches. We will use a branch named `dev` for our development environment.

1.  **Create and Push a `dev` Branch**:
    On your local machine, create a new branch called `dev` and push it to your GitHub repository.
    ```bash
    # Create the new branch locally
    git checkout -b dev

    # Push the new branch to GitHub to create the dev environment
    git push -u origin dev
    ```

2.  **Find Your `dev` Environment URL**:
    *   When you push the `dev` branch, the GitHub Action will trigger a new deployment.
    *   Go to your GitHub repository and click on the **"Actions"** tab. You will see the workflow running for the `dev` branch.
    *   Click on the completed workflow run. In the deployment summary or logs, you will find the URL for your `dev` preview channel. It will be a unique, persistent URL (e.g., `https://sailwell-app-xxxx--dev-prvw.web.app`).
    *   **This is your public `dev` environment URL.** You can use this for testing and internal reviews.

### The Full Workflow: From `dev` to `live`

1.  **Develop**: Make all new code changes on your `dev` branch locally.
    ```bash
    git checkout dev
    # ... make your code changes ...
    git add .
    git commit -m "Add new feature X"
    ```
2.  **Deploy to Dev**: Push your changes to the `dev` branch on GitHub. This updates your `dev` environment.
    ```bash
    git push origin dev
    ```
3.  **Test**: Open your `dev` environment URL and thoroughly test the new features.
4.  **Promote to Live**: Once you are satisfied, merge the `dev` branch into `main`. This will trigger a deployment to your live production site.
    ```bash
    # Switch to the main branch
    git checkout main

    # Ensure your main branch is up-to-date
    git pull origin main

    # Merge the dev branch into main
    git merge dev

    # Push the updated main branch to GitHub
    git push origin main
    ```
5.  **Go Live**: The push to `main` triggers the GitHub Action, which automatically deploys the new version to your live production URL. Your users will now see the changes.
