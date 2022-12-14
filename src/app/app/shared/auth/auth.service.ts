import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  /////////////////////
  // LOCAL STORAGE
  /////////////////////

  /**
   * 
   * @returns the JWT token from local storage
   */
  getToken() {
    return localStorage.getItem('errorJWT');
  }

  /**
   * @returns true(if JWT token exists in the local storage) or false(if JWT token does not exist in the local storage)
   */
  isAuthenticated() {
    //check expiry
    return !!localStorage.getItem('errorJWT');
  }

  //////////////////
  // USER
  //////////////////

  /** 
   * Request Type: GET
   * @returns Gets the role of the user and tells whether the JWT token is expired or not
   * */
  getRole() {
    return this.http.get(`${API}/user/role`);
  }

  //////////////////
  // AUTHENTICATION
  //////////////////

  /**
   * Request Type: POST
   * @param form email and password
   * @returns 
   */
  registerUser(form: FormData) {

    return this.http
    .post<any>(`${API}/user/register`, form, { observe: 'response' });
  }

  /**
   * Request Type: POST
   * @param form email, password and role
   * @returns api response
   */
  authenticateUser(form: FormData) {

    return this.http
    .post<any>(`${API}/user/authenticate`, form, { observe: 'response' });
  }

  /** 
   * Request Type: GET
   * Logs out the user and removes the JWT token from the local storage 
   * */
  logout() {
    console.log('This is Logout')
    this.http.get(`${API}/user/logout`).
    subscribe((data: any) => {
      if (data.response.status === 200) {
        localStorage.removeItem('errorJWT');
        this.router.navigateByUrl('/');
        // this.studentService.currentStudent = null;
      }
    });
  }

  //////////////////
  // OTP
  //////////////////

  /**
   * Request Type: POST
   * @param url the url of the api
   * @param form email and otp
   * @param headers http headers
   * @returns response of the api
   */
   verifyOtp(form: FormData, headers: HttpHeaders) {

    return this.http.post<any>(`${API}/user/verify`, form, { headers: headers, observe: 'response' });
  }

  /**
   * Request Type: POST
   * @param url the url of the api
   * @param email email of the user
   * @param headers http headers
   * @returns response of the api
   */
  regenerateOtp(email: string, headers: HttpHeaders) {

    return this.http.post<any>(`${API}/user/regenerateOTP?email=${email}`,{}, { headers: headers, observe: 'response' });
  }
}
