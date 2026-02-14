# Deployment Guide: Taking Your SailWell App Live

This guide provides a detailed, step-by-step process for deploying your Next.js application to the web using **Firebase App Hosting**. Following these steps will give you a live, publicly accessible URL for your application.

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

## Step 2: Set Up a Git Repository (Recommended)

As we discussed, using Git is crucial for managing different environments (`dev` and `live`). If you haven't already, set up a Git repository.

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of SailWell application"
    ```
2.  **Connect to GitHub** (or a similar service): Create a new repository on GitHub and link it to your local project.
    ```bash
    git remote add origin <your-github-repo-url>
    git push -u origin main
    ```

---

## Step 3: Connect Your Project to Firebase

Now, you'll link your local project to a Firebase project.

1.  **Log in to Firebase**: In your terminal, run:
    ```bash
    firebase login
    ```
    This will open a browser window for you to log in to your Google account and grant permissions to the Firebase CLI.

2.  **Create a Firebase Project**:
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click **"Add project"** and give it a name (e.g., "sailwell-app").
    *   Follow the on-screen steps to create the project. You can disable Google Analytics for now if you wish.

3.  **Initialize Firebase in Your App**:
    *   Back in your terminal, at the root of your project, run:
        ```bash
        firebase init
        ```
    *   This will start an interactive setup process. Here’s how to answer the questions:

        > **Which Firebase features do you want to set up for this directory?**
        >
        > Use the arrow keys to navigate, and the spacebar to select. Choose **"App Hosting: Manage and deploy Next.js web apps to Firebase."** then press Enter.

        > **Please select an option:**
        >
        > Choose **"Use an existing project"**.

        > **Select a default Firebase project for this directory:**
        >
        > Select the Firebase project you just created (e.g., `sailwell-app`).

        > **What is the name of your web app's backend?**
        >
        > You can enter a name like `sailwell-backend` or press Enter to accept the default.

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
        > Select **Yes**. This will configure the GitHub Action to deploy to your live URL whenever you push changes to your `main` branch.

        > **What is the name of your live branch?**
        >
        > Enter `main` (or `master`, depending on your repository's default).

This process creates a `firebase.json` file, a `.firebaserc` file, and a `.github/workflows` directory in your project. These files configure your deployment.

4.  **Commit the Firebase Configuration Files**:
    ```bash
    git add firebase.json .firebaserc .github/
    git commit -m "Configure Firebase App Hosting"
    git push
    ```

---

## Step 4: Deploy Your Application

Your project is now fully configured. To deploy it for the first time manually or to deploy changes outside the automated workflow:

1.  **Run the Deploy Command**:
    ```bash
    firebase deploy
    ```
2.  **Wait for Deployment**: The Firebase CLI will build your Next.js application for production and upload it to App Hosting. This may take a few minutes.

3.  **Get Your Live URL**: Once complete, the terminal will display your **Hosting URL**. It will look something like this:

    ✅ **Hosting URL: https://sailwell-app-xxxx.web.app**

This is the public, permanent link to your live application!

---

## Step 5: Managing `dev` and `live` Environments

The GitHub Action you created automates deployment to your live site from the `main` branch. To set up a `dev` environment:

1.  **Create and Push a `dev` Branch**:
    ```bash
    git checkout -b dev
    git push -u origin dev
    ```

2.  **Update the GitHub Workflow**:
    *   Go to your GitHub repository.
    *   Navigate to the file `.github/workflows/firebase-hosting-pull-request.yml`.
    *   This file is configured to deploy a temporary preview site for every Pull Request. To have a persistent `dev` environment, you can edit the `.github/workflows/firebase-hosting-push.yml` file.
    *   Modify it to also trigger on pushes to the `dev` branch, deploying it to a specific preview channel. Firebase App Hosting supports this out of the box.

By following this setup, any push to `dev` can go to a preview URL for testing, and any merge into `main` will update your live application.
