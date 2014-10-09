This is a Web Terminal application.

Only need a few steps to run this applicaiton:

First, please start vagrant up in base directory:

    vagrant up

Second, connect to the vagrant vis ssh:

    vagrant ssh

Third, use **nodemon** to run the app:

    sudo su
    cd /vagrant/app
    nodemon app.js

Visit the url http://localhost:3000 in your browser, then the dropdown list should be displayed.
	
	