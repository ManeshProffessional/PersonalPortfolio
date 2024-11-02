import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {
  showForm = false;
  errorMessage: string | null = null;
  signupForm!:FormGroup;
  isSubmitted:boolean=false;
  constructor(private renderer: Renderer2,private http: HttpClient,private afs: AngularFirestore,private afAuth: AngularFireAuth) {
    this.signupForm = new FormGroup({
      fullName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/)  // Solo letras y espacios
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{10,15}$/)  // Solo números, entre 10 y 15 dígitos
      ]),
      subject: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required)
    });
   }
  ngOnInit(): void {
    const menuIcon = this.renderer.selectRootElement('#menu-icon', true);
    const navbar = this.renderer.selectRootElement('.navbar', true);
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    const handleScroll = () => {
      sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id:any = sec.getAttribute('id');
        if (top >= offset && top < offset + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.includes(id)) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    const handleMenuIconClick = () => {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('active');
    };

    window.addEventListener('scroll', handleScroll);
    menuIcon.addEventListener('click', handleMenuIconClick);

    handleScroll();
  }
  onSubmit() {
    debugger
    if (this.signupForm.valid) {
      this.http.post('URL_DE_TU_API', this.signupForm.value)
        .subscribe(response => {
          console.log('Respuesta del servidor:', response);
        }, error => {
          console.error('Error al enviar el formulario:', error);
        });
    } else {
      this.isSubmitted  = true;
    }
  }
  get formControls(){
    return this.signupForm.controls;
  }
  downloadPDF(): void {
    const link = document.createElement('a');
    link.href = 'assets/CV_202307251032426.pdf'; // Ruta al archivo PDF en los assets
    link.download = 'CV_202307251032426.pdf'; // Nombre del archivo a descargar
    link.click();
  }
  saveStudent() {
    
      this.afs.collection('students').add(this.signupForm.value)
        .then(() => {
          this.showForm = false;
          this.signupForm.reset();
          alert('Message sent successfully!');
        })
        .catch(error => this.handleError(error));
    
  }
  private handleError(error: any) {
    this.errorMessage = error.message || 'An error occurred.';
  }
}
