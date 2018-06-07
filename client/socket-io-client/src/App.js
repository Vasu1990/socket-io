import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { request } from "https";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      request: ""
    };
    this.recognition = {}
    this.notTalking = true;
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();


    this.recognition.addEventListener('result', e => {
      const last = e.results.length - 1;
      const text = e.results[last][0].transcript;
    
      console.log('result: ' + e.results[0][0].confidence);
      console.log('text: ' + text);
      this.setState({request : text} , () => {
        socket.emit("chatMessage", text);
      });
    });


    this.recognition.onend =  () => {
      this.notTalking = true;
    };

    this.recognition.onerror = () => {
      this.notTalking = true;
    };

    socket.on('bot reply', data => this.setState({ response: data })); 

  }

  talkNow = () => {
    if(this.notTalking) {
      this.notTalking = false;
      this.recognition.start();
    }
  }
  

  render() {
    const { response,request } = this.state;
    return (
        <div style={{ textAlign: "center" }}>
            <button onClick={this.talkNow}>talk</button>
            <div>
              Request: {request}
            </div>
            <div>
              Response: {response}
            </div>
        </div>
    );
  }
}

export default App;