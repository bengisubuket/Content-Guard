### 1. Downloading the Project

#### Prerequisites

**Software and Tools Needed**
- **Git**: To clone the repository.
- **Node.js v16.x**: For compiling the extension and running the frontend server.
- **npm v8.x**: For managing frontend's and extension's dependencies.
- **Any Chromium-based Browser**: For loading the extension.
- **Python 3.x with Django**: For backend server.
- **SQLite**: For the user database.

#### Downloading from the Repository

**Cloning the Repository**
1. Open your terminal.
2. Navigate to the directory where you want to clone the project.
3. Run the following command:
   ```bash
   git clone https://github.com/bengisubuket/Content-Guard.git
   ```
4. Navigate into the project directory:
   ```bash
   cd Content-Guard
   ```

### 2. Setting Up the Environment

#### Installing Dependencies

**Backend Dependencies**
1. Navigate to the backend directory:
   ```bash
   cd content_guard_server
   ```
2. Install the dependencies (install Django given that Python is installed):
   ```bash
   pip install Django
   ```

**Frontend Dependencies**
1. Navigate to the frontend directory:
   ```bash
   cd ..
   cd content-guard-home
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

**Chrome Extension Dependencies**
1. Navigate to the extension directory:
   ```bash
   cd ..
   cd content-guard
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### 3. Running the Backend Server

#### Starting the Server Locally

**Running with Node.js**
1. Navigate to the backend directory:
   ```bash
   cd content_guard_server
   ```
   
2. Create and apply migrations:
   ```bash
   python manage.py makemigrations tweet_handler
   python manage.py migrate tweet_handler
   ```

3. Start the server:
   ```bash
   python manage.py runserver
   ```
   
4. The server should be running at `http://localhost:8000`.

### 4. Setting Up the Chrome Extension

#### Compile the Extension

1. Navigate to the extension directory
```bash
cd ..
cd content-guard
```

2. Run npm to compile.
```bash
npm run build
```

3. Compiled extension should be in /content-guard/dist.

#### Loading the Extension in Chrome

**Loading Unpacked Extension**
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle in the upper right corner.
3. Click "Load unpacked" and select the `dist` directory created in the previous step from the project.

#### Permissions and Settings

**Granting Necessary Permissions**
1. Ensure the `manifest.json` file in the `extension` directory has the required permissions:
   ```json
   {
       "name": "ContentGuard",
       "version": "0.0.1",
       "description": "ContentGuard",
       "permissions": ["storage", "unlimitedStorage", "tabs", "scripting", "activeTab", "fileSystem.write"],
       "host_permissions": ["https://*.twitter.com/*"],
       "background": {
           "service_worker": "background.js"
       },
       "content_scripts": [{
           "matches": ["https://*.twitter.com/*"],
           "js": ["contentScript.js"]
       }],
       "action": {
           "default_icon": {
               "16": "guardian.png",
               "24": "guardian.png",
               "32": "guardian.png"
           },
           "default_title": "trying something",
           "default_popup": "../index.html"
       },
       "web_accessible_resources": [{
           "resources": ["userSettings.json"],
           "matches": ["<all_urls>"]
       }],
       "manifest_version": 3
   }
   ```

### 5. Using the Frontend Application

#### Accessing the Frontend

**URL and Port Information**
- The frontend application is accessible at `http://localhost:3000`.

#### Navigating the User Interface

**Main Dashboard**
- Upon logging in, you will be directed to the main dashboard where you can see an overview of your data and activities.

**Key Features and Functionalities**
- **Navigation Bar**: Access different sections like Dashboard, Reports, Profile.

#### Common User Actions

**Logging In**
1. Open the frontend application in your browser.
2. Use Twitter authentication to login.

**Viewing Analytics**
1. Navigate to the "Reports" section from the navigation bar.
2. View detailed reports and statistics.

### 6. Using the Services Provided by the Extension

- ContentGuard enhances your Twitter experience with additional tools that supply better control over the content you see.
- For a detailed demo, you can watch our usage demo at https://www.youtube.com/watch?v=-iHRPVs-4Ys.

### 7. Troubleshooting and FAQs

#### Common Issues and Solutions

**Issue: MacOS and (probably) Linux are not supported for running the servers.**
- **Solution**: Use a Windows machine. Clients should work fine.

### 8. Contact and Support

#### Contact Information of Group Members
- **Twitter**: https://twitter.com/contentguard21
- **Github**: https://github.com/bengisubuket/Content-Guard

#### Reporting Bugs and Requesting Features
- To report bugs or request features, please visit our [GitHub Issues](https://github.com/bengisubuket/Content-Guard/issues) page and create a new issue.
