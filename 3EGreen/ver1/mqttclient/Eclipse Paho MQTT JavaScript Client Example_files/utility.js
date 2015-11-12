/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    James Sutton - Initial Contribution
 *******************************************************************************/

/*
Eclipse Paho MQTT-JS Utility
This utility can be used to test the Eclipse Paho MQTT Javascript client.
*/

// Create a client instance
client = null;
msgQueue = new Array();
startflag = 0;
pkt_index = 0;
bleindex = 0 ;
BLE_item_len = 0;
m = 0;
item_count = 0;
connected = false;

hashtable = new Array();

var follow = (getUrlVars()["follow"] == null) ? false : getUrlVars()["follow"];


function parsingPacket(pktmessage)
{

  var table = document.getElementById("incomingMessageTable").getElementsByTagName('tbody')[0];
  msglen = pktmessage.length;
  pktindex=0;
  pktlen = parseInt(pktmessage.substring(pktindex,pktindex+2),16);
  pktcmd = pktmessage.substring(pktindex+2,pktindex+4);
  pktData = pktmessage.substring(pktindex+14,pktindex+(pktlen*2));
  var temp = Array();

  try{  
  temp = pktmessage.split("484541443A");
  for(a=0;a<temp.length-1;a++){
  var cbox = document.getElementById("stickyLog");
  if(stickyLog.checked)
  {
  table.scrollTop = table.scrollHeight;
  }
  pktlen = parseInt(pktmessage.substring(pktindex,pktindex+2),16);

  
  pktcmd = pktmessage.substring(pktindex+2,pktindex+4);

  if(pktcmd=="00"){
         
          var row = table.insertRow(table.length); 
		  var cell0 = row.insertCell(0);
		  cell0.style.width="10%" ;
		  cell0.style.fontSize="8pt";
          cell0.innerHTML = "=============";
          
		  var cell1 = row.insertCell(1);
		  cell1.style.width="10%" ;
		  cell1.style.fontSize="8pt";
		  cell1.innerHTML = "============";
		  
		  var cell2 = row.insertCell(2);
		  cell2.style.width="20%" ;
		  cell2.style.fontSize="8pt";
          cell2.innerHTML = "====================";
		  
		  var cell3 = row.insertCell(3);
		  cell3.style.width="60%" ;
		  cell3.style.fontSize="8pt";
          cell3.innerHTML = "============ Totle "+item_count+" Items ==========";
		   item_count = 0;
  }
  else
  {
  pktData = pktmessage.substring(pktindex+14,pktindex+(pktlen*2));
  
  BLE_address = inverseStr(pktData.substring(0,12));
  BLE_type = pktData.substring(12,14);
  BLE_rssi = -parseInt(pktData.substring(14,16),16);
  BLE_data = pktData.substring(16,pktlen*2);
  BLE_data_len =  parseInt(BLE_data.length,16);
  /*
  if($('#stickyLog').is(':checked'))
  {
  
      //$("#logContents").append(" BLE_address : ("+BLE_address.toString() + ") BLE_rssi : (" + BLE_rssi.toString() + ") BLE_data ("+ BLE_data.toString() + ") \n");
	  $("#logContents").append(" BLE_address : ("+BLE_address.toString() + ") BLE_rssi : (" + BLE_rssi.toString()+") \n");
	  $("#logContents").prop("scrollTop", $("#logContents").prop("scrollHeight") - $("#logContents").height());
  }
  else
  {
      //$("#logContents").append(" BLE_address : ("+BLE_address.toString() + ") BLE_rssi : (" + BLE_rssi.toString() + ") BLE_data ("+ BLE_data.toString() + ") \n");
	  $("#logContents").append(" BLE_address : ("+BLE_address.toString() + ") BLE_rssi : (" + BLE_rssi.toString()+") \n");
  }
  */

  bleindex = 0;
  next_BLE_item_len = parseInt(BLE_data.substring(bleindex,bleindex+2),16);
  for(bleindex = 0; (bleindex + next_BLE_item_len*2) < BLE_data_len+1;){
  
  currItemlen = parseInt(BLE_data.substring(bleindex,bleindex+2),16);
  
  if(currItemlen>0)
  {
  BLE_item_type = BLE_data.substring(bleindex+2,bleindex+4);
  BLE_item_data = BLE_data.substring(bleindex+2,bleindex+2 + (currItemlen*2));
  

      if(BLE_item_type=="09")
	  {
          var row = table.insertRow(table.length);
		  var cell0 = row.insertCell(0);
		  cell0.style.width="10%" ;
		  cell0.style.fontSize="8pt";
          cell0.innerHTML = BLE_address;
          
		  var cell1 = row.insertCell(1);
		  cell1.style.width="10%" ;
		  cell1.style.fontSize="8pt";
		  cell1.innerHTML = BLE_rssi;
		  
		  var cell2 = row.insertCell(2);
		  cell2.style.width="20%" ;
		  cell2.style.fontSize="8pt";
          cell2.innerHTML ="Complete local name (" + BLE_item_type + ")";
		  var cell3 = row.insertCell(3);
		  cell3.style.width="60%" ;
		  cell3.style.fontSize="8pt";
		  str = ascii2str(BLE_item_data);
		  cell3.innerHTML = str;
	  }
	  else if(BLE_item_type == "FF")
	  {
          var row = table.insertRow(table.length);
		  var cell0 = row.insertCell(0);
		  cell0.style.width="10%" ;
          cell0.style.fontSize="8pt";
		  cell0.innerHTML = BLE_address;
          
		  var cell1 = row.insertCell(1);
		  cell1.style.width="10%" ;
		  cell1.style.fontSize="8pt";
		  cell1.innerHTML = BLE_rssi;
		  
		  var cell2 = row.insertCell(2);
		  cell2.style.width="20%";
		  cell2.style.fontSize="8pt";		  
          cell2.innerHTML ="manufacture (" + BLE_item_type + ")";
		  
		  var cell3 = row.insertCell(3);
		  cell3.style.width="60%";
		  cell3.style.fontSize="8pt";
          cell3.innerHTML = BLE_item_data;

	  }
	  else
	  {
	      var row = table.insertRow(table.length);

		  var cell0 = row.insertCell(0);
		  cell0.style.width="10%";
		  cell0.style.fontSize="8pt";
          cell0.innerHTML = BLE_address;
          
		  var cell1 = row.insertCell(1);
		  cell1.style.width="10%";
		  cell1.style.fontSize="8pt";
		  cell1.innerHTML = BLE_rssi;
		  
		  var cell2 = row.insertCell(2);
		  cell2.style.width="20%";
		  cell2.style.fontSize="8pt";
          cell2.innerHTML = BLE_item_type;
		  
		  var cell3 = row.insertCell(3);
		  cell3.style.width="60%";
		  cell3.style.fontSize="8pt";
          cell3.innerHTML = BLE_item_data;
		//$("#logContents").append(" BLE_item_len : ("+ currItemlen.toString() + ") BLE_item_type : (" + BLE_item_type.toString() + ") BLE_item_data : (" + BLE_item_data.toString() + ")\n") ;
	    //$("#logContents").prop("scrollTop", $("#logContents").prop("scrollHeight") - $("#logContents").height());

	  }
 
      //$("#logContents").append("T: BLE_item_len : ("+BLE_item_len.toString() + ") bleindex : ("+bleindex.toString() + ") BLE_data_len : (" +BLE_data_len.toString() +")\n");
	  bleindex = bleindex + 2 + currItemlen * 2;
	  
      next_BLE_item_len = parseInt(BLE_data.substring(bleindex,bleindex+2),16);
      //$("#logContents").append(" next_BLE_item_len : ("+ next_BLE_item_len.toString() + ") bleindex : ("+ bleindex.toString() + ") remain_BLE_data : (" + BLE_data.substring(bleindex,BLE_data_len) + ") BLE_data_len : (" + BLE_data_len + ")\n");
	  
  }
  else
  {
      //$("#logContents").append(" ER BLE_item_len : ("+ currItemlen.toString() + ")\n");
  	  bleindex = BLE_data_len+2;
  }
  }
  hash_code = hashCode(BLE_address);
  if(hashtable["hash_code"]!= null){item_count++;}
  else {hashtable["hash_code"] = 1;}
  

  }
  
  pktindex+=pktlen*2;
  }
  }
  //$("#logContents").append(msgQueue.length +" messages in Queue \n");
  catch(err){ $("#logContents").append(err.toString());
 }
  //$("#logContents").append(pktlen.toString() + " command : "+pktcmd.toString() + " message : " + pktData.toString() + "\n");
  //$("#logContents").append(pktlen.toString() +"\n");
}

function parsingPayload(message)
{

}

function showData()
{
  // Insert into History Table
  var messageTime = new Date().toISOString();

 
  setInterval(function(){ 
  if(msgQueue.length>0)
  {
  
  var msg = msgQueue.pop();
  var payload = msg.payloadString;
  var header = new Array();
  header = payload.split("484541443A",2);

  var pktmessage = payload.split(header[0],2);
  len=header[0].length;
  pktmessage = header[0].substring(len-4,len)+pktmessage[1]; 
  parsingPacket(pktmessage);
  }
 }, 300);
 
}
  
  
// called when the client connects
function onConnect(context) {
  // Once a connection has been made, make a subscription and send a message.
  //console.log("Client Connected");
  //$("#logContents").append("into loop \n");
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Connected to: " + context.invocationContext.host + ':' + context.invocationContext.port + context.invocationContext.path + ' as ' + context.invocationContext.clientId;
  connected = true;
  setFormEnabledState(true);
  showData();

}

function onFail(context) {
  //console.log("Failed to connect");
  var statusSpan = document.getElementById("connectionStatus");
  statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
  connected = false;
  setFormEnabledState(false);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    //console.log("Connection Lost: " + responseObject.errorMessage);
  }
  connected = false;
}

// called when a message arrives
function onMessageArrived(message) {
  //$("#logContents").append("message arrive {"+ message.payloadString.length +"}\n");
  msgQueue.push(message);

  
  
  
  //update last message (if new)  
  /*
  if(!document.getElementById(message.destinationName)){
      
      var lastMessageTable = document.getElementById("lastMessageTable").getElementsByTagName('tbody')[0];
      var newlastMessageRow = lastMessageTable.insertRow(0);
      newlastMessageRow.id = message.destinationName;
      newlastMessageRow.insertCell(0).innerHTML = msg.destinationName;
      newlastMessageRow.insertCell(1).innerHTML = safe_tags_regex(msg.payloadString);
   	  newlastMessageRow.insertCell(2).innerHTML = messageTime;
      newlastMessageRow.insertCell(3).innerHTML = msg.qos;

  } else {
      // Update Last Message Table
      var lastMessageRow = document.getElementById(msg.destinationName);
      lastMessageRow.id = msg.destinationName;
      lastMessageRow.cells[0].innerHTML = msg.destinationName;
      lastMessageRow.cells[1].innerHTML = safe_tags_regex(msg.payloadString);
      lastMessageRow.cells[2].innerHTML = messageTime;
      lastMessageRow.cells[3].innerHTML = msg.qos;
  }
  */
}

function connectionToggle(){

  if(connected){
    disconnect();
  } else {
    connect();
  }


}


function connect(){
    var hostname = document.getElementById("hostInput").value;
    var port = document.getElementById("portInput").value;
    var clientId = document.getElementById("clientIdInput").value;

    var path = document.getElementById("pathInput").value;
    var user = document.getElementById("userInput").value;
    var pass = document.getElementById("passInput").value;
    var keepAlive = Number(document.getElementById("keepAliveInput").value);
    var timeout = Number(document.getElementById("timeoutInput").value);
    var ssl = document.getElementById("sslInput").checked;
    //var cleanSession = document.getElementById("cleanSessionInput").checked;
    var cleanSession = true;
    var lastWillTopic = document.getElementById("lwtInput").value;
    var lastWillQos = Number(document.getElementById("lwQosInput").value);
    var lastWillRetain = document.getElementById("lwRetainInput").checked;
    var lastWillMessage = document.getElementById("lwMInput").value;


    if(path.length > 0){
      client = new Paho.MQTT.Client(hostname, Number(port), path, clientId);
    } else {
      client = new Paho.MQTT.Client(hostname, Number(port), clientId);
    }
    console.info('Connecting to Server: Hostname: ', hostname, '. Port: ', port, '. Path: ', client.path, '. Client ID: ', clientId);

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;


    var options = {
      invocationContext: {host : hostname, port: port, path: client.path, clientId: clientId},
      timeout: timeout,
      keepAliveInterval:keepAlive,
      cleanSession: cleanSession,
      useSSL: ssl,
      onSuccess: onConnect,
      onFailure: onFail
    };



    if(user.length > 0){
      options.userName = user;
    }

    if(pass.length > 0){
      options.password = pass;
    }

    if(lastWillTopic.length > 0){
      var lastWillMessage = new Paho.MQTT.Message(lastWillMessage);
      lastWillMessage.destinationName = lastWillTopic;
      lastWillMessage.qos = lastWillQos;
      lastWillMessage.retained = lastWillRetain;
      options.willMessage = lastWillMessage;
    }

    // connect the client
    client.connect(options);
    var statusSpan = document.getElementById("connectionStatus");
    statusSpan.innerHTML = 'Connecting...';
}

function disconnect(){
    console.info('Disconnecting from Server');
    client.disconnect();
    var statusSpan = document.getElementById("connectionStatus");
    statusSpan.innerHTML = 'Connection - Disconnected.';
    connected = false;
    setFormEnabledState(false);

}

// Sets various form controls to either enabled or disabled
function setFormEnabledState(enabled){

    // Connection Panel Elements
    if(enabled){
      document.getElementById("clientConnectButton").innerHTML = "Disconnect";
    } else {
      document.getElementById("clientConnectButton").innerHTML = "Connect";
    }
    document.getElementById("hostInput").disabled = enabled;
    document.getElementById("portInput").disabled = enabled;
    document.getElementById("clientIdInput").disabled = enabled;
    document.getElementById("pathInput").disabled = enabled;
    document.getElementById("userInput").disabled = enabled;
    document.getElementById("passInput").disabled = enabled;
    document.getElementById("keepAliveInput").disabled = enabled;
    document.getElementById("timeoutInput").disabled = enabled;
    document.getElementById("sslInput").disabled = enabled;
    document.getElementById("cleanSessionInput").disabled = enabled;
    document.getElementById("lwtInput").disabled = enabled;
    document.getElementById("lwQosInput").disabled = enabled;
    document.getElementById("lwRetainInput").disabled = enabled;
    document.getElementById("lwMInput").disabled = enabled;

    // Publish Panel Elements
    document.getElementById("publishTopicInput").disabled = !enabled;
    document.getElementById("publishQosInput").disabled = !enabled;
    document.getElementById("publishMessageInput").disabled = !enabled;
    document.getElementById("publishButton").disabled = !enabled;
    document.getElementById("publishRetainInput").disabled = !enabled;

    // Subscription Panel Elements
    document.getElementById("subscribeTopicInput").disabled = !enabled;
    document.getElementById("subscribeQosInput").disabled = !enabled;
    document.getElementById("subscribeButton").disabled = !enabled;
    document.getElementById("unsubscribeButton").disabled = !enabled;

}

function publish(){
    var topic = document.getElementById("publishTopicInput").value;
    var qos = document.getElementById("publishQosInput").value;
    var message = document.getElementById("publishMessageInput").value;
    var retain = document.getElementById("publishRetainInput").checked
    console.info('Publishing Message: Topic: ', topic, '. QoS: ' + qos + '. Message: ', message);
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = Number(qos);
    message.retained = retain;
    client.send(message);
}


function subscribe(){
    var topic = document.getElementById("subscribeTopicInput").value;
    var qos = document.getElementById("subscribeQosInput").value;
    console.info('Subscribing to: Topic: ', topic, '. QoS: ', qos);
    client.subscribe(topic, {qos: Number(qos)});
	$("#subscribeList").append("<span style='line-height: 20px; margin:5px 5px 5px 0;' id='"+topic+"' class='label label-info'>"+topic+"&nbsp;</span>");
}

function unsubscribe(){
    var topic = document.getElementById("subscribeTopicInput").value;
    client.unsubscribe(topic, {
         onSuccess: unsubscribeSuccess,
         onFailure: unsubscribeFailure,
         invocationContext: {topic : topic}
     });
	 var elem = document.getElementById(topic);
			elem.parentNode.removeChild(elem);
}


function unsubscribeSuccess(context){
    console.info('Successfully unsubscribed from ', context.invocationContext.topic);
}

function unsubscribeFailure(context){
    console.info('Failed to  unsubscribe from ', context.invocationContext.topic);
}



// Just in case someone sends html
function safe_tags_regex(str) {
   return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function clearLog() {
    var table = document.getElementById("incomingMessageTable");
    //or use :  var table = document.all.tableid;
    for(var i = table.rows.length - 1; i > 0; i--)
    {
        table.deleteRow(i);
    }
}



function ascii2str(message)
{
    len = message.length;
    i=0;
	str2="";
	str3="(";
	str5 ="";
    for(i=0; i<len; i=i+2)
	{
	 str  = parseInt(message.substring(i,i+2),16);
     str1 = String.fromCharCode(str);	 
	 //str4 = str2.toString();
	 str2 = str2.concat(str1);
	}
	return str2;

}

function inverseStr(str)
{
   var len2 = str.length;
   var str2 = "";
   str2 = str2.concat(str.substring(len2-2,len2));
   for(i=len2-4;i>=0;i=i-2)
   {
   str2=str2.concat(":");
   str2=str2.concat(str.substring(i,i+2));
   }
   return str2;
}

function hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}