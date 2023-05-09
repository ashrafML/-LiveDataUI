import { Component,ChangeDetectorRef, NgZone,NgModule } from '@angular/core';
import { LiveStreamService } from './live-stream-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  streamedData: number[] = [];
  sendstrmData: number;
  constructor(private signalrService: LiveStreamService, private ngZone: NgZone) {
   
    // this.signalrService.getStreamData().subscribe((data) => {
     
    //   this.ngZone.run(() => {
    //     this.streamedData.push(data);
    //   });
    //   console.log(data)
    // });
    this.signalrService.ListenToButionSend();
    this.signalrService.startStreamingAudiom();
    this.signalrService.LsitenToAudio();
    
  }
  
  sendStreamData() {
    this.signalrService.sendStreamData(this.sendstrmData);
    this.sendstrmData = null;
  }
  public stopStreaming() {
    this.signalrService.stopStreamingAudio();
  }
  public getAudioDataUri() {
    
    const audioData = new Uint8Array(this.streamedData).buffer;
    const blob = new Blob([audioData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
   // return url;
  }
}
