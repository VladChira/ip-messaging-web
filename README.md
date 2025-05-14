# Messaging App frontend with Next.js

## Working locally

### Clone this repo on your machine
To clone the repo, run the following command:
```bash
git clone https://github.com/VladChira/ip-messaging-web.git
```
You will be asked to enter your credentials. For the password, you must enter a Personal Access Token instead of your account password. Click [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) to learn how to create a token.

### Installing dependencies
Install ``node`` and ``npm`` if they are not already installed. Visit [node.js website](https://nodejs.org/en/download) to learn how to download and install depending on your platform. Node 20 and above is fine.
To verify, run:
```bash
$ node -v
v22.14.0
```
and
```bash
npm -v
10.9.2
```

### Creating a branch
Create a new branch using ``git branch <branch name>`` and switch to it with ``git checkout <branch name>``. Here is where you will work on features. When ready to merge to main, push to the branch and submit a pull request.


### Running the app
If it's your first time running the app, install the necessary npm packages with ``npm install``. To launch the app, simply run ``npm run dev`` and access it via ``http://localhost:3000/messaging``.

Warning: The app runs under a subpath ``/messaging`` in order to allow the upstream nginx on the server to correctly redirect traffic. If you try to access pages without the ``/messaging`` subpath, you will get a ``404 Not found`` error. Ask Vlad if you want more information.



## Deploying to production
To deploy your code to production, submit a pull request. After it's merged to the main branch, a Github workflow will automatically deploy the app to the server. You can then access it by going to <redacted>/messaging

You may review the workflow that deploys this app in the ``.github/workflows`` folder and/or ask Vlad for more info. 
