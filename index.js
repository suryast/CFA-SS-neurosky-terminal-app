/** BEGIN connect to neurosky **/
const neurosky = require('node-neurosky');
const client = neurosky.createClient({
  appName: 'NodeNeuroSky',
  appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
});

//create variables to contained raw and parsed JSON from websocket
var jsondata = JSON.new;
var parsed = JSON.new;

// bind receive data event
client.on('data', function(data) {
  // if websocket server is running
  if (wss) {
    // broadcast this latest data packet to all connected clients
    wss.broadcast(data);
  }

  jsondata = JSON.stringify(data);
  parsed = JSON.parse(jsondata);
  // console.log(parsed);

  // handle "eSense" data
  if (parsed.eSense) {
    attention = parsed.eSense.attention;
    meditation = parsed.eSense.meditation;

    // create donut chart using blessed
    var blessed = require('blessed'),
      contrib = require('blessed-contrib/index'),
      screen = blessed.screen();

    var grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: screen
    });
    /**
     * Donut Options
      self.options.stroke = options.stroke || "magenta"
      self.options.radius = options.radius || 14;
      self.options.arcWidth = options.arcWidth || 4;
      self.options.spacing = options.spacing || 2;
      self.options.yPadding = options.yPadding || 2;
     */

    // determine dimension of donuts
    var donut = grid.set(0, 0, 6, 12, contrib.donut,
      {
      label: 'Brain Status',
      radius: 30,
      arcWidth: 10,
      yPadding: 2,
      data: [{
        percent: 80,
        label: 'meditation',
        color: 'green'
      }]
    });

    // blessed function, append screen with donut
    screen.append(donut);

    // create varying color depending on the value from websocket transmission
    var color_att = "green";
    if (attention >= 25) color_att = "cyan";
    if (attention >= 50) color_att = "yellow";
    if (attention >= 75) color_att = "red";

    var color_med = "green";
    if (meditation >= 25) color_med = "cyan";
    if (meditation >= 50) color_med = "yellow";
    if (meditation >= 75) color_med = "red";

    // set the value of the chart and keep it moving
    donut.setData([{
        percent: attention,
        label: 'Attention',
        'color': color_att
      },
      {
        percent: meditation,
        label: 'Meditation',
        'color': color_med
      }
    ]);

    var bar = grid.set(6, 0, 6, 8, contrib.bar,
      {
      label: 'EEG(%)',
      barWidth: 6,
      barSpacing: 2,
      xOffset: 0,
      maxHeight: 10000,
      height: "40%"
    });

    screen.append(bar);

    bar.setData({
      titles: ['delta', 'theta', 'lowAlpha', 'highAlpha', 'lowBeta', 'highBeta', 'lowGamma', 'highGamma'],
      data: [parsed.eegPower.delta, parsed.eegPower.theta, parsed.eegPower.lowAlpha, parsed.eegPower.highAlpha, parsed.eegPower.lowBeta, parsed.eegPower.highBeta, parsed.eegPower.lowGamma, parsed.eegPower.highGamma]
    });

    // var line = grid.set(6, 0, 6, 12, contrib.line,
    //    { width: 80
    //    , height: 30
    //    , left: 15
    //    , top: 12
    //    , xPadding: 5
    //    , minY: 30
    //    , maxY: 90
    //    , label: 'Title'
    //    , style: { baseline: 'white' }
    //  });
    //
    // var data = [ { title: 'Raw EEG',
    //              x: ['delta', 'theta', 'lowAlpha', 'highAlpha', 'lowBeta', 'highBeta', 'lowGamma', 'highGamma'],
    //              y: [parsed.eegPower.delta, parsed.eegPower.theta, parsed.eegPower.lowAlpha, parsed.eegPower.highAlpha, parsed.eegPower.lowBeta, parsed.eegPower.highBeta, parsed.eegPower.lowGamma, parsed.eegPower.highGamma],
    //              style: {
    //               line: 'red'
    //              }
    //            }
    //         ];
    //
    //
    // screen.append(line); //must append before setting data
    // line.setData(data);

    // escape control
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    // render on screen
    screen.render();

    // var line = contrib.line(
    //    { width: 80
    //    , height: 30
    //    , left: 15
    //    , top: 12
    //    , xPadding: 5
    //    , minY: 30
    //    , maxY: 90
    //    , label: 'Title'
    //    , style: { baseline: 'white' }
    //    })
    //
    // , data = [ { title: 'us-east',
    //              x: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    //              y: [50, 88, 72, 91],
    //              style: {
    //               line: 'red'
    //              }
    //            }
    //         ]
    //
    //
    // screen.append(line) //must append before setting data
    // line.setData(data)
  }

  // handle "poorSignal" parsed
  if (parsed.poorSignalLevel !== null) {
    poorSignalLevel = parseInt(parsed.poorSignalLevel);
    console.log('\x1b[41m', 'Poor signal – awaiting transmission', '\x1b[0m');
  }
});

// initiate connection
client.connect();
/** END connect to neurosky **/

/** BEGIN start our websocket server **/
// start websocket server to broadcast
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  port: 8090
});

// broadcast function (broadcasts message to all clients)
wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(JSON.stringify(data));
};
