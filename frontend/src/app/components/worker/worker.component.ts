import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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


  constructor(private subjectService: SubjectService, private router: Router, private documentService: DocumentService) { }

  ngOnInit(): void {
    this.searchSubjectsVisible = false;
    this.resultSubjectsVisible = false;
    this.document_archived = false;
    this.searchDocumentsVisible = false;
    this.resultDocumentsVisible = false;
  }

  searchSubjects() {
    let keywords_array;
    let documents_array;
    let employees_array;
    if (this.keywords) {
      keywords_array = this.keywords.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      keywords_array = keywords_array.filter(x => x != "");
      keywords_array = keywords_array.map(x => x.match(/[^\"].*[^\"]/)[0]);
    }
    if (this.document_names) {
      documents_array = this.document_names.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      documents_array = documents_array.filter(x => x != "");
      documents_array = documents_array.map(x => x.match(/[^\"].*[^\"]/)[0]);
    }
    if (this.employees) {
      employees_array = this.employees.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      employees_array = employees_array.filter(x => x != "");
      employees_array = employees_array.map(x => x.match(/[^\"].*[^\"]/)[0]);
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

      }
      else {
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
      document_tags_array = document_tags_array.map(x => x.match(/[^\"].*[^\"]/)[0]);
    }
    if (this.document_subjects) {
      document_subjects_array = this.document_subjects.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      document_subjects_array = document_subjects_array.filter(x => x != "");
      document_subjects_array = document_subjects_array.map(x => x.match(/[^\"].*[^\"]/)[0]);
    }
    let document = {
      document_title: this.document_title,
      document_submission_date: this.document_submission_date,
      document_subjects: document_subjects_array ? document_subjects_array : undefined,
      document_description: this.document_description,
      document_tags: document_tags_array ? document_tags_array : undefined,
    }

    let document2 = Object.keys(document).reduce((result, key) => {
      if (document[key] != "") {
        result[key] = document[key];
      }
      else result[key] = undefined;
      return result;
    }, {});

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
    }

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

}
