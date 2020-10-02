import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DocumentService } from 'src/app/services/document.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: Array<any>;
  documents: Array<any>;
  subjects: Array<any>;

  employee_username: string;
  showEmployeeDocuments: boolean;
  showEmployeeSubjects: boolean;
  transferSubjectToEmployee: boolean;

  selected_employee: any;
  selected_subject: any;

  constructor(private subjectService: SubjectService, private documentService: DocumentService, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {

    this.showEmployeeSubjects = false;
    this.showEmployeeDocuments = false;
    this.transferSubjectToEmployee = false;

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.employee_username = user.username;

    this.subjectService.getSubjects({employees: this.employee_username}).subscribe(
      (data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
        }
        else if(data.subject.length > 0) {
          this.subjects = data.subject;
          let subject_names = this.subjects.map(a => a.title);
          this.documentService.getUnarchivedDocuments({subjects:subject_names}).subscribe((data: any)=>{
            if (!data.success) {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
            else{
              this.documents = data.documents;
            }
          });
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

  }

  transferSubject(){
    if(this.selected_employee.username == this.employee_username){
      this.flashMessage.show("Vec ste zaduzeni za ovaj predmet!", { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
    let selected_subject_employees = this.selected_subject.employees;
    let new_employees = selected_subject_employees.filter(x => x!=this.employee_username);
    new_employees.push(this.selected_employee.username);
    let keys = {
      title: this.selected_subject.title,
      subjects: this.selected_subject.subjects
    }
    let params = {
      employees: new_employees
    }

    this.subjectService.modifySubject(keys, params).subscribe((data: any)=>{
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
      else {
        this.flashMessage.show("Uspjesno proslijedjen predmet", { cssClass: 'alert-success', timeout: 3000 });
        this.toggleShowEmployeeDocuments();
        this.toggleShowEmployeeSubjects();
        this.toggleTransferSubjectToEmployee();
        this.subjectService.getSubjects({employees: this.employee_username}).subscribe(
          (data: any) => {
            if (!data.success) {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
            else if (data.subject.length > 0) {
              this.subjects = data.subject;
              let subject_names = this.subjects.map(a => a.title);
              this.documentService.getUnarchivedDocuments({subjects:subject_names}).subscribe((data: any)=>{
                if (!data.success) {
                  this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
                }
                else{
                  this.documents = data.documents;
                }
              });
            }
            else {
              this.subjects = undefined;
              this.documents = undefined;
            }
          }
        );
      }
    });

  }

  toggleShowEmployeeDocuments(){
    this.showEmployeeDocuments = !this.showEmployeeDocuments;
  }

  toggleShowEmployeeSubjects(){
    this.showEmployeeSubjects = !this.showEmployeeSubjects;
  }

  toggleTransferSubjectToEmployee(){
    this.transferSubjectToEmployee = !this.transferSubjectToEmployee;
  }



}
