import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
interface Student {
  id?: string; // Optional, for new students
  name: string;
  studentCode: string;
  mobileNumber: string;
  address: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  students: any[] = [];
  showForm = false;
  formTitle = 'Add';
  studentForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private afs: AngularFirestore, private fb: FormBuilder) {
    debugger
    this.studentForm = this.fb.group({
      id: [''], // Include id for updates
      name: ['', Validators.required],
      studentCode: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getStudents().subscribe(
      students => this.students = students,
      error => this.handleError(error)
    );
  }

  getStudents(): Observable<Student[]> { 
    return this.afs.collection<Student>('students').valueChanges({ idField: 'id' }) as unknown as Observable<Student[]>;
  }
  
  
  

  addStudent() {
    this.showForm = true;
    this.formTitle = 'Add';
    this.studentForm.reset();
  }


  deleteStudent(id: string) {
    this.afs.doc(`students/${id}`).delete()
      .then(() => {
        alert('Student deleted successfully!');
      })
      .catch(error => this.handleError(error));
  }

  cancel() {
    this.showForm = false;
    this.studentForm.reset();
  }

  private handleError(error: any) {
    this.errorMessage = error.message || 'An error occurred.';
  }

}
