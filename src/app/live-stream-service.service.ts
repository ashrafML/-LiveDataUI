import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Observable, Subject,throwError  } from "rxjs";
import { retryWhen, delay, takeWhile, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: "root",
})
export class LiveStreamService {
  private hubConnection: HubConnection;
  private streamDataSubject: Subject<number> = new Subject<number>();
  private scriptNode: ScriptProcessorNode | null = null;
  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:http:your port in api/BroadcastHub/BroadcastHub")
      .build();

    this.startConnection();
  }

  private async startConnection() {
    try {
      await this.hubConnection.start();
      console.log("connected");
      this.listenToStreamData();
    } catch (error) {
      console.log("Failed to connect:", error);
      setTimeout(() => this.startConnection(), 5000);

    }
    
  }
public ListenToButionSend(){
  this.hubConnection.on('ReceiveMyStreamData', (data) => {
    console.log('ReceivedButon:', data);
    this.streamDataSubject.next(data);
  });
}
public startStreamingAudiom() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const sampleRate = audioContext.sampleRate;

    this.scriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    this.scriptNode.onaudioprocess = (event) => {
      const buffer = event.inputBuffer.getChannelData(0);
      const data = new Int16Array(buffer.length);

      for (let i = 0; i < buffer.length; i++) {
        data[i] = buffer[i] * 32767;
      }

      this.hubConnection.send('SendAudioStreamData', data, sampleRate);
    };

    sourceNode.connect(this.scriptNode);
    this.scriptNode.connect(audioContext.destination);
  }).catch((err) => {
    console.error(err);
  });
}
public stopStreamingAudio() {
  if (this.scriptNode !== null) {
    this.scriptNode.disconnect();
    this.scriptNode = null;
  }
}
public startStreamingAudio() {
  this.hubConnection.invoke('StreamAudio').catch((err) => {
    console.error(err);
  });
}
public LsitenToAudio(){
  this.hubConnection.on('ReceiveAudioStreamData', (data) => {
    console.log('ReceivedAu:');
    this.streamDataSubject.next(data);
  });
}
  private listenToStreamData() {
   
    this.hubConnection.stream("StreamData").subscribe({
      next: (item) => this.streamDataSubject.next(item),
      error: (err) => console.error(err),
      complete: () => console.log("Stream completed"),
    });
  }

  public getStreamData(): Observable<number> {
    return this.streamDataSubject.asObservable().pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(5000),
          takeWhile(() => !this.hubConnection.stop),
          catchError((err) => throwError(err))
        )
      )
    );
  }
  public sendStreamData(data: number) {
    this.hubConnection.send('SendStreamData', data);
  }
}
