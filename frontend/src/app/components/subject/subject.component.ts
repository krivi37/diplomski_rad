import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DocumentService } from 'src/app/services/document.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  subjects: Array<any>;
  employees: Array<any>;
  documents: Array<any>;

  selected: any;

  addSubjectVisible: boolean;
  modifySubjectVisible: boolean;

  document_names: string;
  title: string;
  keywords: string;
  description: string;
  submitter: string;
  category: string;
  id_number: string;
  department: string;
  subject_employees: string;

  constructor(private subjectService: SubjectService, private documentService: DocumentService, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this.subjectService.getSubjects({}).subscribe(
      (data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
        }
        else {
          this.subjects = data.subject;
        }
      }
    );

    this.subjectService.getEmployees().subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
      else {
        this.employees = data.employees;
      }
    });

    this.documentService.getUnarchivedDocuments({}).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
      else {
        this.documents = data.documents;
      }
    });

  }

  addSubject() {
    if (!(this.title) || !(this.keywords) || !(this.description) || !(this.submitter) || !(this.category) || !(this.id_number) || !(this.department) || !(this.subject_employees)) {
      this.flashMessage.show("Morate unijeti sva polja!", { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
    let employee_array = this.subject_employees.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
    employee_array = employee_array.filter(x => x != "");
    employee_array = employee_array.map(x => x.replace(/\"/g, ""));
    let employee_names = this.employees.map(a => a.username);
    let difference = employee_array.filter(x => !employee_names.includes(x));
    if (difference.length != 0) {
      this.flashMessage.show(`Nepostojeci zaposleni: ${difference}`, { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
    let keywords_array = this.keywords.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
    keywords_array = keywords_array.filter(x => x != "");
    keywords_array = keywords_array.map(x => x.replace(/\"/g, ""));
    let newSubject = {
      title: this.title,
      keywords: keywords_array,
      description: this.description,
      submitter: this.submitter,
      category: this.category,
      id_number: this.id_number,
      department: this.department,
      employees: employee_array
    }
    this.subjectService.addSubject(newSubject).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
      else {
        this.flashMessage.show("Uspjesno zaveden novi predmet", { cssClass: 'alert-success', timeout: 3000 });
      }
    });
  }

  modifySubject() {
    let documents_array;
    let keywords_array;
    let employee_array;
    if (this.document_names) {
      documents_array = this.document_names.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      documents_array = documents_array.filter(x => x != "");
      documents_array = documents_array.map(x => x.replace(/\"/g, ""));
    }
    if (this.keywords) {
      keywords_array = this.keywords.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      keywords_array = keywords_array.filter(x => x != "");
      keywords_array = keywords_array.map(x => x.replace(/\"/g, ""));
    }
    if (this.subject_employees) {
      employee_array = this.subject_employees.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      employee_array = employee_array.filter(x => x != "");
      employee_array = employee_array.map(x => x.replace(/\"/g, ""));
    }
    let difference;
    if (this.subject_employees) {
      let subject_employees = this.employees.map(a => a.username);
      difference = employee_array.filter(x => !subject_employees.includes(x));
      if (difference.length != 0) {
        this.flashMessage.show(`Nepostojeci zaposleni: ${difference}`, { cssClass: 'alert-danger', timeout: 3000 });
        return false;
      }
    }

    if (this.document_names) {
      let existing_documents = this.documents.map(a => a.title);
      difference = documents_array.filter(x => !existing_documents.includes(x));
      if (difference.length != 0) {
        this.flashMessage.show(`Nepostojeci dokumenti: ${difference}`, { cssClass: 'alert-danger', timeout: 3000 });
        return false;
      }
    }
    let modifiedSubject = {
      title: this.selected.title,
      description: this.description ? this.description : undefined,
      keywords: keywords_array ? keywords_array : undefined,
      id_number: this.id_number ? this.id_number : undefined,
      submitter: this.submitter ? this.submitter : undefined,
      documents: documents_array ? documents_array : undefined,
      employees: employee_array ? employee_array : undefined,
      category: this.category ? this.category : undefined,
      department: this.department ? this.department : undefined
    }
    this.subjectService.modifySubject(this.selected, modifiedSubject).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
      else {
        this.flashMessage.show("Uspjesno azuriran dokument", { cssClass: 'alert-success', timeout: 3000 });
      }
    });

  }

  toggleAddSubjectVisible() {
    this.document_names = undefined;
    this.title = undefined;
    this.keywords = undefined;
    this.description = undefined;
    this.submitter = undefined;
    this.category = undefined;
    this.id_number = undefined;
    this.department = undefined;
    this.subject_employees = undefined;
    this.addSubjectVisible = !this.addSubjectVisible;
  }

  toggleModifySubjectVisible() {
    this.document_names = undefined;
    this.title = undefined;
    this.keywords = undefined;
    this.description = undefined;
    this.submitter = undefined;
    this.category = undefined;
    this.id_number = undefined;
    this.department = undefined;
    this.subject_employees = undefined;
    this.selected = undefined;
    this.subjectService.getSubjects({}).subscribe(
      (data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
        }
        else {
          this.subjects = data.subject;
        }
      }
    );
    this.modifySubjectVisible = !this.modifySubjectVisible;

  }

}
