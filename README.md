###### English

# WebChat

#### You can check out the front-end of this application here: https://github.com/arielscht/webchat-frontend
#### You can access the website here: https://node-online-chat-frontend.herokuapp.com
##### Note: It might take some time to load and to make the first request due to Heroku free hosting services.

The setup of the project for you to test in your own machine is at the end of this page.

###### I hope you like the project, and please consider giving it a star.

## Project overview

This is the back-end of a web chat developed with Node.js together with Express, using socket.io for a real-time experience.
The goal with this project was to practice all my new skills with React.js and Node.js.
I also wanted to try using the websocket protocol, which is amazing, and it opens a whole new set of possibilities and a whole new experience for the website.

Main Features:

- Add friends;
- Send Messages;
- Receive Messages;
- Messages notifications;
- Visualization confirmation;
- Show online friends;
- Show friends that are typing;

It worth mentioning that everything works in real-time, like receiving a friend request, accepting it, receiving a message and notification, and of course the visualization confirmation, which means that there is no need for refreshing the page in order to receive any new incoming data.

Making the UI really beautiful was not a priority, but it is responsive and definitely meets the purpose.

## Project Details

### Login Page

![Login Page](https://user-images.githubusercontent.com/48089807/94050686-fb449700-fdac-11ea-99d5-6cb24f0f7717.jpg)

### Signup Form

![Signup Page](https://user-images.githubusercontent.com/48089807/94051008-5d9d9780-fdad-11ea-8e0a-9c6a1e04d740.jpg)

### Validation Error

All the forms have validation, in case of any validation error, an message will appear inside a red box as shown below.

![validation error](https://user-images.githubusercontent.com/48089807/94051349-ca189680-fdad-11ea-8e31-e3231a018586.jpg)

### Home page

When you login in the website, you will be redirected to the home page, as a new user, you will not have any friends yet. The home page for a new user is shown below.

![Login gif](https://user-images.githubusercontent.com/48089807/94052427-524b6b80-fdaf-11ea-9ac5-305a0933b365.gif)

### Sending friend request

In order to find users to add as a friend, you must click in the 'add friend' tab. Now you can just search by name or username.

![Add friend Gif](https://user-images.githubusercontent.com/48089807/94053394-a86cde80-fdb0-11ea-8f72-3cfbb903439f.gif)

### Receiving and Accepting a friend request

As already said at the introduction of the project, everything is using websocket, so you should receive a friend request as soon as someone invites you.

![receiving friend request](https://user-images.githubusercontent.com/48089807/94054632-444b1a00-fdb2-11ea-83fd-746cd9d8bfce.gif)

### Friend request being accepted

Again no page refresh is required for seeing new friends that accepted your requests

![request being accepted](https://user-images.githubusercontent.com/48089807/94056336-8c6b3c00-fdb4-11ea-8dda-fa38f35bdae8.gif)

### Sending and receiving messages

In the image below we can see messages being sent and received, and some other details like: 

- User is online message;
- User is typing;
- Visualization confirmation;
- Last message sent or received with a specific friend is shown in the sidebar;
- Time, day of week, or date of last message exchanged with a friend is also shown in the sidebar;

![sending and receiving messages](https://user-images.githubusercontent.com/48089807/94063700-dfe28780-fdbe-11ea-9ad3-12826128470e.gif)

### Notification of new messages

When someone send you a new message, a notification sound will play, and the number of new messages will appear aside of the sender in the sidebar. And the total amount of new messages will me shown in the browser tab.
Another important detail, is that the users with the most recent messages will always be on top of the sidebar.

![messages being received](https://user-images.githubusercontent.com/48089807/94065014-e8d45880-fdc0-11ea-9629-e1a8e4034757.gif)

Total unread messages

![unread messages](https://user-images.githubusercontent.com/48089807/94065127-128d7f80-fdc1-11ea-98db-6d0ab0ddbc57.jpg)

### Responsive design

As already said at the top of this page, the UI also has a responsive design

![responsive design](https://user-images.githubusercontent.com/48089807/94066476-e8d55800-fdc2-11ea-9f1c-e0972dd343ad.gif)

## Setup

In order for being able of testing this project in your own machine, you can clone it and create a .env file in the main directory with the following envorimental variables: 
#### `PORT`
#### `NODE_ENV=development`
#### `DB_HOST`
#### `DB_USERNAME`
#### `DB_PASSWORD`
#### `DB_NAME`
You must fill all the variables with the desired database credencials and server port.
After setting the .env file you must run
### `npm install` 
to install all the dependencies and then
### `npx knex migrate:latest`
to run all the migrations in the 'migrations' folder and create the database structure.
And then, finally run
### `npm start` 
to start the local server, or
### `npm run dev`
to start the server with nodemon.