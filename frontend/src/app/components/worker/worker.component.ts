import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DocumentService } from 'src/app/services/document.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent implements OnInit {

  subjects: Array<any>;
  documents: Array<any>;

  resultSubjectsVisible: boolean;
  searchSubjectsVisible: boolean;

  searchDocumentsVisible: boolean;
  resultDocumentsVisible: boolean;

  document_names: string;
  id_number: string;
  submission_date: Date;
  title: string;
  description: string;
  keywords: string;
  category: string;
  submitter: string;
  employees: string;
  department: string;

  document_title: string;
  document_submission_date: Date;
  document_subjects: string;
  document_description: string;
  document_tags: string;
  document_archived: boolean;

  showArchived: boolean;


  constructor(private subjectService: SubjectService, private router: Router, private documentService: DocumentService, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this.searchSubjectsVisible = false;
    this.resultSubjectsVisible = false;
    this.document_archived = false;
    this.searchDocumentsVisible = false;
    this.resultDocumentsVisible = false;
    this.showArchived = false;
  }

  getAllDocuments(){
    this.searchDocumentsVisible = false;
    this.documentService.getAllDocuments({}).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 1500});
      }
      else {
        this.documents = data.documents;
      }
    });
  }

  getAllSubjects(){
    this.searchSubjectsVisible = false;
    this.subjectService.getSubjects({}).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 1500});
      }
      else {
        this.subjects = data.subject;
      }
    });
  }

  searchSubjects() {
    let keywords_array;
    let documents_array;
    let employees_array;
    if (this.keywords) {
      keywords_array = this.keywords.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      keywords_array = keywords_array.filter(x => x != "");
      keywords_array = keywords_array.map(x => x.replace(/\"/g, ""));
    }
    if (this.document_names) {
      documents_array = this.document_names.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      documents_array = documents_array.filter(x => x != "");
      documents_array = documents_array.map(x => x.replace(/\"/g, ""));
    }
    if (this.employees) {
      employees_array = this.employees.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      employees_array = employees_array.filter(x => x != "");
      employees_array = employees_array.map(x => x.replace(/\"/g, ""));
    }
    let subject = {
      id_number: this.id_number,
      title: this.title,
      submission_date: this.submission_date,
      description: this.description,
      submitter: this.submitter,
      department: this.department,
      keywords: keywords_array ? keywords_array : undefined,//ovakav regex dozvoljava koriscenje znaka razmaka unutar navodnika
      documents: documents_array ? documents_array : undefined,
      employees: employees_array ? employees_array : undefined
    }

    let subject2 = Object.keys(subject).reduce((result, key) => {
      if (subject[key] != "") {
        result[key] = subject[key];
      }
      else result[key] = undefined;
      return result;
    }, {});

    this.subjectService.getSubjects(subject2).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 1500});
      }
      else {
        this.searchSubjectsVisible = false;
        this.subjects = data.subject;
      }
    });
  }

  searchDocuments() {
    let document_tags_array;
    let document_subjects_array;

    if (this.document_tags) {
      document_tags_array = this.document_tags.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      document_tags_array = document_tags_array.filter(x => x != "");
      document_tags_array = document_tags_array.map(x => x.replace(/\"/g, ""));
    }
    if (this.document_subjects) {
      document_subjects_array = this.document_subjects.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      document_subjects_array = document_subjects_array.filter(x => x != "");
      document_subjects_array = document_subjects_array.map(x => x.replace(/\"/g, ""));
    }
    let document = {
      title: this.document_title,
      submission_date: this.document_submission_date,
      subjects: document_subjects_array ? document_subjects_array : undefined,
      description: this.document_description,
      tags: document_tags_array ? document_tags_array : undefined,
    }

    let document2 = Object.keys(document).reduce((result, key) => {
      if (document[key] != "") {
        result[key] = document[key];
      }
      else result[key] = undefined;
      return result;
    }, {});

    /* If we don't want to always drag all documents from server, we can call different functions for getting unarchived and all documents
    if (this.document_archived) {
      this.documentService.getAllDocuments(document2).subscribe((data: any) => {
        if (!data.success) {

        }
        else {
          this.documents = data.documents;
        }
      });
    }
    else {
      this.documentService.getUnarchivedDocuments(document2).subscribe((data: any) => {
        if (!data.success) {

        }
        else {
          this.documents = data.documents;
        }
      });
    }*/

    // Drag all documents from server, and then toggle display for archived
    this.documentService.getAllDocuments(document2).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 1500});
      }
      else {
        this.searchDocumentsVisible = false;
        this.documents = data.documents;
      }
    });

  }

  editSubjectsOrDocuments() {
    this.router.navigate(['/editpage']);
  }

  toggleSearchSubjects() {
    this.searchSubjectsVisible = !this.searchSubjectsVisible;
  }

  toggleResultSubjectsVisible() {
    this.resultSubjectsVisible = !this.resultSubjectsVisible;
  }

  toggleResultDocumentsVisible() {
    this.resultDocumentsVisible = !this.resultDocumentsVisible;
  }
  toggleSearchDocumentsVisible() {
    this.searchDocumentsVisible = !this.searchDocumentsVisible;
  }
  
  clearDocumentDate(){
    this.document_submission_date = undefined;
  }

  clearSubjectDate(){
    this.submission_date = undefined;
  }

  deleteSubject(subject: any){
    this.subjectService.deleteSubject(subject).subscribe((data: any)=>{
      if (!data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 1500});
      }
      else {
        this.subjectService.getSubjects({}).subscribe((data: any) => {
          if(!data.success){

          }
          else {
            this.subjects = data.subject;
          }
        });
        this.documentService.getAllDocuments({}).subscribe((data: any) => {
          if(!data.success){

          }
          else {
            this.documents = data.documents;
          }
        });
      }
    });
  }

  deleteDocument(document: any){
    this.documentService.deleteDocument(document).subscribe((data: any)=>{
      if (!data.success) {  
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 1500});
      }
      else {
        this.documentService.getAllDocuments({}).subscribe((data: any) => {
          if(!data.success){

          }
          else {
            this.documents = data.documents;
          }
        });
        this.subjectService.getSubjects({}).subscribe((data: any) => {
          if(!data.success){

          }
          else {
            this.subjects = data.subject;
          }
        });
      }
    });
  }

}
