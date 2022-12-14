import { SelectionModel } from '@angular/cdk/collections';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { filter, finalize, map } from 'rxjs/operators';
import { CompanyService } from 'src/app/company/company.service';
import { VisualFeedbackService } from 'src/app/shared/visual-feedback/visual-feedback.service';
import { AdminComponent } from '../admin.component';
import { AdminService } from '../admin.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';

var gid;
@Component({
  selector: 'dialog-confirm-approve-dialog',
  templateUrl: './confirm-approve-dialog.html',
  styleUrls: ['./confirm-approve-dialog.scss'],
  providers:[
    {
      provide :STEPPER_GLOBAL_OPTIONS,
      useValue :{displayDefaultIndicatorType:false},
    }
  ]
})
export class ConfirmApprovalDialog implements OnInit{
  
  minDate: Date;
  maxDate: Date;
  
  driveid:any;
  driveResponse:any;
  drivename:any;
  companyname:any;
  ugvacancies:any;
  pgvacancies:any;
  ugcourses:any;
  noofugcourses:any;
  noofpgcourses:any;
  pgcourses: any;
  category:any;
  yrseligible:any;
  ugcgpa:any;
  pgcgpa:any;
  sslc:any;
  hsc:any;
  arrears:any;
  foreign_nations:any;
  emptype:any;
  roles:any;
  bonddetails:any;
  ctc:any;
  fixedpay:any;
  trainingprob:any;
  stipend:any;
  job_description:any;
  separate_date:any;
  confirm_status:any;
  enable:any;
  form: FormGroup = new FormGroup(
    {
      date_tech: new FormControl(""),
      date_nontech:new FormControl(""),
      registration_end:new FormControl(""),
    }
  )

  
  constructor(private visualFeedback: VisualFeedbackService, private companyService: CompanyService,private adminsService:AdminService) {
    this.enable=false;
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    // this.driveResponse=this.companyService.getDriveFromDriveID(gid);
   
  }
  set_schedule(){
    
    console.log(this.form.value.date_tech);
    if(this.separate_date==true){
      console.log(this.form.value.date_nontech);
    }
    console.log(this.form.value.registration_end );
    console.log(this.form.value.registration_end );
    const req=new FormData();
    req.append('driveid', this.driveid.toString());
    req.append('techdate',this.form.value.date_tech.toString());
    req.append('nontechdate',this.form.value.date_nontech.toString());
    req.append('regdate',this.form.value.registration_end.toString());
    req.append('sep_flag',this.separate_date.toString());
    req.append('confirmstatus',"true");
    this.adminsService.setscheduledrive(req).subscribe(() => {
      this.visualFeedback.snackBar("Schedule Date set successfully");

  }
  , (error) => {

      console.log(error);
      this.visualFeedback.snackBar(error);
  }
  );
    this.enable=true;
  }
  ngOnInit(){
    this.companyService.getDriveFromDriveID(gid).subscribe(
      (data:any)=>{
        this.driveResponse=data;
        this.drivename=data["drive"]["drive_name"];
        this.companyname=data["drive"]["company"]["name"];
        this.ugvacancies=data["drive"]["ug_vacancies"];
        this.pgvacancies=data["drive"]["pg_vacancies"];
        this.ugcgpa=data["drive"]["eligibility_in_present"];
        this.pgcgpa=data["drive"]["eligibility_graduation"];
        this.sslc=data["drive"]["eligibility_10"];
        this.hsc=data["drive"]["eligibility_12"];
        this.emptype=data["drive"]["employment_type"]["emp_type"];
        this.roles=data["drive"]["roles"];
        this.trainingprob=data["drive"]["salary_training_probation"];
        this.ctc=data["drive"]["ctc"];
        this.fixedpay=data["drive"]["annual_salary"];
        this.stipend=data["drive"]["stipend_for_internship"];
        this.job_description=data["drive"]["other_information"];
        this.separate_date=data["drive"]["different_recruitment_dates"];
        this.driveid=data["drive"]["id"];
        this.bonddetails=data["drive"]["bond_details"]==""?"nil":data["drive"]["bond_details"];
        if(data["drive"]["current_arrears"]==true || data["drive"]["history_of_arrears"]==true ){
          this.arrears="Allowed ( "+data["drive"]["atmost_number_of_arrears"] +" )";
        }
        else{
          this.arrears="Not Allowed!";
        }
        
        if(data["drive"]["allow_foreign_nationals"]==true){
          if(data["drive"]["foreign_nationality_preferred"]!="nil"){
            this.foreign_nations="Allowed ( "+data["drive"]["foreign_nationality_preferred"]+" )";
          }
          else{
            this.foreign_nations="Allowed";
          }
        }
        else{
          this.foreign_nations="Not Allowed";
        }
        this.ugcourses=[];
        this.pgcourses=[];
        for(let it of data["drive"]["eligible_courses"]){
          if(it["programme"]=="UG"){
            this.ugcourses.push(it["branch"]);
          }
          else{
            this.pgcourses.push(it["branch"]);
          }
        }
        this.noofpgcourses=this.pgcourses.length;
        this.noofugcourses=this.ugcourses.length;
        this.yrseligible=[];
        for(let it of data["drive"]["year_batch_eligible"]){
          this.yrseligible.push(it);
        }
        this.category=data["drive"]["category"]["category"];
        // console.log("fon : "+this.form.valid);
      }
    )
    
  }
}

interface DriveApprove {

  serial_number: number,
  name: string,
  company_name: string,
  id: number,
}

interface DriveApproveFilters {

  name: {filters: string[]},
  company_name: {filters: string[]},
}

/**
 * @title Table with pagination
 */
 @Component({
    selector: 'app-company-approval',
    templateUrl: './company-approval.component.html',
    styleUrls: ['./company-approval.component.scss']
})
export class CompanyApprovalComponent implements OnInit, AfterViewInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
 
  displayedColumns: string[] = ['serial_number', 'name', 'company_name','button'];

  dataSource = new MatTableDataSource<DriveApprove>();

  filters: DriveApproveFilters = {

    name: {
      filters: [],
    },

    company_name: {
        filters: [],
    }
  }

  driveList: any[];
  driveApproveList: DriveApprove[];

  private _approving = false;

  get approving(): boolean {

    return this._approving && (!this.driveList || this.driveList.length !== 0);
  }

  @Input() set driveListInput(driveList: any[]) {

    if(!driveList) return;

    this.driveList = driveList;
    this.driveApproveList = driveList.map((drive: any, index: number): DriveApprove => {

        return {

          serial_number: index + 1,
          name: drive.drive_name,
          company_name: drive.company.name,
          id: drive.id,
        }
    });

    this.dataSource = new MatTableDataSource<DriveApprove>(this.driveApproveList);
    if(!!driveList) this.dataSource.data = this.applyFilters();
  }

  @Output() driveListChange = new EventEmitter<any[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private dialog: MatDialog, private companyService: CompanyService, private adminService: AdminService, private visualFeedback: VisualFeedbackService) { }

  ngOnInit(): void {
      
    if(!this.driveList) this.setDatasource();
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
  }

  setDatasource() {

    this.companyService.getAllDrives().pipe(

      map((response: any): DriveApprove[] => {

        console.log(response);

        this.driveList = response.companies.filter((company) => !company.is_approved);

        return this.driveList.map((company: any, index: number): DriveApprove => {

            return {
    
                serial_number: index + 1,
                name: company.drive_name,
                company_name: company.company.name,
                id: company.id,
            }
        });
      }) 

    ).subscribe(list => {

      this.driveApproveList = list;
      this.dataSource = new MatTableDataSource<DriveApprove>(list);
      this.dataSource.data = this.applyFilters();
      this.driveListChange.emit(this.driveList);
    });
  }

  detailedView(row: DriveApprove) {

    const driveModel = this.driveList.find((drive) => drive.id === row.id);

    console.log(driveModel);

    //  this.dialog.open(DriveApprovalDetailsComponent, {
    //   panelClass: 'student-approval-details-dialog',
    //   data: {
    //     student: driveModel,
    //   }
    // });
  }
  opendialogbox(row:DriveApprove){
    gid=row.id;
    const ref = this.dialog.open(ConfirmApprovalDialog);
    ref.afterClosed().pipe(

      filter((result) => result),
  ).
  subscribe(() => {
      this._approving = true;
      this.adminService.approveDrive(row.id).pipe(

          finalize(() => {

              this._approving = false;
              // this.visualFeedback.snackBar("Drive approved successfully");
          }) 

      ).subscribe(() => {
  
          this.setDatasource();
          this.visualFeedback.snackBar("Drive approved successfully");

      }
      , (error) => {
  
          console.log(error);
          this.visualFeedback.snackBar(error);
      }
      );
  })
    
  }
  // approveDrive(row: DriveApprove) {

  //   console.log(row);

  //   console.log("approving");

  //   const ref = this.dialog.open(ConfirmApprovalDialog);

  //   ref.afterClosed().pipe(

  //       filter((result) => result),

  //   ).
  //   subscribe(() => {

  //       this._approving = true;
  //       this.adminService.approveDrive(row.id).pipe(

  //           finalize(() => {

  //               this._approving = false;
  //               // this.visualFeedback.snackBar("Drive approved successfully");
  //           }) 

  //       ).subscribe(() => {
    
  //           this.setDatasource();
  //           this.visualFeedback.snackBar("Drive approved successfully");

  //       }
  //       , (error) => {
    
  //           console.log(error);
  //           this.visualFeedback.snackBar(error);
  //       }
  //       );
  //   })


  //   // if(approvedStudents.length === 0) return;

  //   // const driveList = JSON.stringify(approvedStudents).replace('[', '').replace(']', '');

  //   // const form = new FormData();

  //   // form.set('student_list', driveList);

  //   // this._approving = true;

  //   // this.adminService.approveDrive(form).pipe(

  //   //   mergeMap((response) => {

  //   //     this._approving = false;

  //   //     if(response.response.status === 200) {

  //   //       this.setDatasource();
  //   //     }

  //   //     return this.companyService.getStudent();
  //   //   })

  //   // ).
  //   // subscribe((response: any) => {

  //   //   this.companyService.currentStudent = response.profile;      
  //   // });
  // }

   ///////////////////////
    // FILTERS
    ///////////////////////

    private applyFilters(): DriveApprove[] {

      let filteredData: DriveApprove[] = Array.from(this.driveApproveList);

      Object.keys(this.filters).forEach((filterColumn) => {

          if(this.filters[filterColumn].filters.length === 0) return;

          filteredData = filteredData.filter((student) => {

              const pred = this.filters[filterColumn].filters.map((filter) => filter.toString().toLowerCase()).includes(student[filterColumn].toString().toLowerCase());
              return pred;
          });
      });

      return filteredData;
  }

  add(event: MatChipInputEvent, column: string, type: 'text' | 'number'): void {
      const value = (event.value || '').trim();

      let values: (string | number)[] = value.split(',');

      if(type === "number") values = values.map(value => parseInt(value.toString()));

      if(value) values.forEach(value => this.filters[column].filters.push(value));

      this.dataSource.data = this.applyFilters();
  
      // Clear the input value
      event.input.value = '';
  }

  remove(filter: string | number, column: string): void {
      
      const index = this.filters[column].filters.indexOf(filter);

      if (index >= 0) {

          this.filters[column].filters.splice(index, 1);
          this.dataSource.data = this.applyFilters();
      }
  }

  clearFilters(column: string) {

      this.filters[column].filters = [];
      this.dataSource.data = this.applyFilters();
  }
}