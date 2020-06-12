import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DatacaptureService {

  private api_base = "https://voting.magodoresidentsassociation.org/index.php/";
	constructor(public http: HttpClient) {
	}
  reloadVotersList: EventEmitter<any> = new EventEmitter();
  getlistofvoter(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/getListOfVoters', data, { headers: headers });
  }
  createnewvoter(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/createnewvoter', data, { headers: headers });
  }
  updatevoter(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/updatevoter', data, { headers: headers });
	}
	deletevoter(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/delete', data, { headers: headers });
	}
	getVoter(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/getvoter', data, { headers: headers });
	}
	login(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/login', data, { headers: headers });
	}
	updatePassword(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/updatepassword', data, { headers: headers });
	}
	savespousedetails(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/savespouse', data, { headers: headers });
	}
	saveMyProfilePicture(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/saveMyProfilePicture', data, { headers: headers });
	}
	saveMySpouseProfilePicture(data) {
		const headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this.http.post(this.api_base + 'accreditation/saveMySpouseProfilePicture', data, { headers: headers });
	}
}
