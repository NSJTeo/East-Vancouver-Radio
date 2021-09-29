# Welcome to East Vancouver Radio

"I'm too broke for Airtime.pro & Shoutcast. I'm too dumb to deploy Icecast on Windows." - Me

This project will allow you to run a local Node.js-based radio-streaming server: all you gotta do is import your music, install some dependencies and voila. There's also a little Windows 95/98-themed client I made for exploring the server's current functionality. The client has a socket.io-based chat room and basic file management system (upload & delete). Currently the chat log is based on JSON, which means it gets overwhelmed pretty easy. My next step is to move this over to MongoDB. Wish me luck!

You can visit a demo [here](http://sleepy-dusk-99333.herokuapp.com/). I'm on the free-tier so please excuse the slow startup.

One thing to note is that I tailored this for the DJ experience: as an ex-"radio manager" myself, I like to give everyone a one hour slot to do their thing. The server will automatically stream the next file whenever one finishes, but I've added some code that will force the server to play the next file at the top of every hour (node-schedule), even in the middle of songs.

The website & concept work best when you feed the server mixes that last just a bit over an hour.

## Setting it all up

The first thing to do is put some music into the server. Drag & drop your favourite mp3s into `East-Vancouver-Radio-main/server/music` and you're good to go. If you're hosting locally, 320kbps mp3s are probably ideal, but when deploying, 128kbps is more bandwidth-friendly. This thing handles variable mp3 bitrates but I'm not sure how it's going to handle .wav or .aiff or other music file types: be sure to let me know if you try!

Also the player will use mp3's ID3 tags to populate the show information, so make sure those are up to date!

First, let's make sure the server is ready. Open up your terminal and input the following:

`cd server`
`npm i`
`npm start`

You should get a console log indicating the port that the server is listening on, as well as a "Station started" notification. It's time to listen to the stream.

In a separate instance of terminal:

`cd client`
`npm i` (this one might take a minute or two)
`npm start`

If React's working right, your browser should open to http://localhost:3000/.

Happy listening!

## Client-side file management

"Why is there client-side file management?" Yes, sorry, this is purely for demonstrative purposes. You can give it a shot yourself though! In the client, open up the "Setup" window by clicking one of the Setup icons.

Username is _user_ and password is _user_. While I'd love to hear your selections, this password combination won't work on the heroku deployment.

If the whole process worked out, you should see a list of the mp3s in your music folder. Please do not delete the currently playing track! If you need to delete it from the client-side while the server is running, upload another song and wait for it to finish playing.

As for uploading... I'm working on implementing some visual cues for the process but when you upload, **wait for your file to populate the mp3 list.** That's a sure sign that it's been fully uploaded to the server.

## Scheduling

The scheduling is a bit limited, I'll admit. Node is going to read the music folder files in alphanumerical order, so before you upload the "first" song in the schedule, prepend it with a 01, like `01-your-first-song.mp3` and then prepend the second with 02 `02-your-second-song` etc etc. That's all I got for a workaround right now.

## Thank you!
