# Neurosky Terminal App

## Summary
This is a Node terminal app built using publicly available open-source libraries to mimic the working of Neurosky's Brainwave Visualiser application – https://store.neurosky.com/products/visualizer-2-0.

## Prerequisites
Copied from https://github.com/odrulea/neurosky-node-websocket

1. get the project files from git into a local working directory.
2. you will need a Mindwave Mobile headset, sold by Neurosky -> http://store.neurosky.com/.
3. you will need Neurosky's "ThinkGear Connector" (TGC) installed and running on your machine to receive signal from your headset ->  http://developer.neurosky.com/docs/doku.php?id=thinkgear_connector_tgc
make sure you are able to start the connector and see signal strength indicator working with your headset.
4. you will need node.js installed on your machine -> http://nodejs.org/.
5. installing node also installs node package manager (npm). on command line, use npm to install the two required node packages:
```
npm install node-neurosky
```
```
npm install ws
```
Specific for this terminal app:
```
npm install blessed blessed-contrib
```

More info on these packages here:
- node-neurosky -> https://www.npmjs.org/package/node-neurosky
- websocket -> https://github.com/einaros/ws
- blessed-contrib -> https://github.com/yaronn/blessed-contrib

## Getting Started
1. Turn on your Mindwave Mobile headset and connect to the ThinkGear Connector app on your machine.
2. From command line, go to root level of your local working directory.
3. Start the node server
```
node index.js
```
you should see streaming data from the headset output on the command line
if you see the following data, it indicates no connection:
```
 Poor signal – establishing connection
```
it can take up to 30 seconds for the headset to connect, so if you see the poorSignalLevel, just give it a moment to connect.
4. Once connection is successful, data will begin streaming on the terminal.
