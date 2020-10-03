import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DocumentService } from 'src/app/services/document.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  documents: Array<any>;
  subjects: Array<any>;
  selected: any;

  addDocumentVisible: boolean;
  modifyDocumentVisible: boolean;

  document_title: string;
  document_subjects: string;
  document_description: string;
  document_tags: string;

  constructor(private subjectService: SubjectService, private documentService: DocumentService, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this.addDocumentVisible = false;
    this.modifyDocumentVisible = false;
    this.subjectService.getSubjects({}).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
      }
      else {
        this.subjects = data.subject;
      }
    });
    this.documentService.getUnarchivedDocuments({}).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
      }
      else {
        this.documents = data.documents;
      }
    });
  }

  addDocument() {
    if ((this.document_title == undefined || this.document_title == "") ||
      (this.document_description == undefined || this.document_description == "") ||
      (this.document_tags == undefined || this.document_tags == "") ||
      (this.document_subjects == undefined || this.document_subjects == "")) {
      this.flashMessage.show("Morate popuniti sva polja!", { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    let document_tags_array = this.document_tags.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
    document_tags_array = document_tags_array.filter(x => x != "");
    document_tags_array = document_tags_array.map(x => x.replace(/\"/g, ""));

    // Ovo je uradjeno kako bi se ignorisali bijeli karakteri unutar navodnika, a takodje se izbacuju sami navodnici iz niza nakon uparivanja
    let document_subjects_array = this.document_subjects.split(/[ ,]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
    document_subjects_array = document_subjects_array.filter(x => x != "");
    document_subjects_array = document_subjects_array.map(x => x.replace(/\"/g, ""));

    let subject_names = this.subjects.map(a => a.title);
    let difference = document_subjects_array.filter(x => !subject_names.includes(x));
    if (difference.length != 0) {
      this.flashMessage.show(`Nepostojeći predmeti: ${difference}, morate kreirate predmete prvo`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    else {
      let newDocument = {
        title: this.document_title,
        description: this.document_description,
        tags: document_tags_array,
        subjects: document_subjects_array
      }
      this.documentService.addDocument(newDocument).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
        else {
          this.flashMessage.show("Uspješno dodat novi dokument!", { cssClass: 'alert-success', timeout: 2000 });
          this.documentService.getUnarchivedDocuments({}).subscribe((data: any) => {
            if (!data.success) {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
            }
            else {
              this.documents = data.documents;
            }
          });
          this.toggleAddDocumentVisible();
        }
      });
    }
  }

  //Mozda nije potrebno posto se cuvaju stare verzije dokumenata
  modifyDocument() {
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
    let difference;
    if (this.document_subjects) {
      let subject_names = this.subjects.map(a => a.title);
      difference = document_subjects_array.filter(x => !subject_names.includes(x));
      if (difference.length != 0) {
        this.flashMessage.show(`Nepostojeći predmeti: ${difference}, morate kreirate predmete prvo`, { cssClass: 'alert-danger', timeout: 2000 });
        return false;
      }
    }
    difference = document_subjects_array ? document_subjects_array.filter(x => !this.selected.subjects.includes(x)).concat(this.selected.subjects.filter(x => !document_subjects_array.includes(x))) : undefined;
    let archivedDocument = {
      title: this.selected.title,
      description: this.selected.description,
      tags: this.selected.tags,
      subjects: this.selected.subjects,
      archived: true
    }
    if (difference?.length > 0) {
      this.documentService.archiveDocument(archivedDocument).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
        else {
          let newDocument = {
            title: this.selected.title,
            description: this.document_description ? this.document_description : this.selected.description,
            tags: document_tags_array ? document_tags_array : this.selected.tags,
            subjects: document_subjects_array ? document_subjects_array : this.selected.subjects
          }
          this.documentService.addDocument(newDocument).subscribe((data: any) => {
            if (!data.success) {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
            }
            else {
              this.flashMessage.show("Uspješno azuriran dokument!", { cssClass: 'alert-success', timeout: 2000 });
              this.toggleModifyDocumentVisible();
            }
          });
        }
      });
    }
    else {
      let newDocument = {
        title: this.selected.title,
        description: this.document_description ? this.document_description : this.selected.description,
        tags: document_tags_array ? document_tags_array : this.selected.tags,
        subjects: this.selected.subjects
      }
      this.documentService.addDocument(newDocument).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
        else {
          this.flashMessage.show("Uspješno azuriran dokument!", { cssClass: 'alert-success', timeout: 2000 });
          this.toggleModifyDocumentVisible();
        }
      });
    }
  }

  toggleAddDocumentVisible() {
    this.document_subjects = undefined;
    this.document_tags = undefined;
    this.document_title = undefined;
    this.document_description = undefined;
    this.addDocumentVisible = !this.addDocumentVisible;
  }

  toggleModifyDocumentVisible() {
    this.document_subjects = undefined;
    this.document_tags = undefined;
    this.document_title = undefined;
    this.document_description = undefined;
    this.modifyDocumentVisible = !this.modifyDocumentVisible;
    this.documentService.getUnarchivedDocuments({}).subscribe((data: any) => {
      if (!data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
      }
      else {
        this.documents = data.documents;
      }
    });
  }

}
