# CampgroundConnect
This is biggest project I've built so far.

CampgroundConnect is a fully functional node.js web app with a mongoDB backend, RESTful routes, user authentication, authorization, and a frontend of HTML, CSS, Bootstrap, JavaScript, and jQuery.

You can sign up and your login is stored in the database while your password is encrypted then stored with its hash. Thus, I my database encrypts your password and it's never stored, only an ecrypted password is stored.

You can create a new campground, edit the campground you create, or delete it from the database. You are free to test this all out yourself; I just ask that you don't write anything derogatory or inflamatory.

Authorization is also a feature to this app. You can only edit or delete campgrounds or comments you create. So, if you want to sign up as a different user to test this, you are more that welcome to.

Essentially, only the persont that creates their campground can edit or delete it. I've created authorization with my own middleware that I've attached to the necessary routes.

You can see the live working version hosted on heroku here: https://aqueous-lowlands-33100.herokuapp.com/
