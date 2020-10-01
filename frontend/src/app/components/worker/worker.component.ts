import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent implements OnInit {

  subjects: Array<any>;
  documents: Array<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
