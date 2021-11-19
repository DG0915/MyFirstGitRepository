import { LightningElement,track} from "lwc";
import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import MOVIE_OBJECT from "@salesforce/schema/movieFeedback__c";
 
import MOVIENAME_FIELD from "@salesforce/schema/movieFeedback__c.Movie_Name__c";
import USERNAME_FIELD from "@salesforce/schema/movieFeedback__c.Contact_Name__c";
import USERPHONE_FIELD from "@salesforce/schema/movieFeedback__c.User_Phone__c";
import USEREMAIL_FIELD from "@salesforce/schema/movieFeedback__c.User_Email_Id__c";
import MOVIEDATE_FIELD from "@salesforce/schema/movieFeedback__c.Movie_Watching_Date__c";
import RATING_FIELD from "@salesforce/schema/movieFeedback__c.rating__c";
import FEEDBACK_FIELD from "@salesforce/schema/movieFeedback__c.Movie_Feedback__c";
 
 
const QUERY_URL = "https://www.omdbapi.com/?t=";
const QUERY_URL_2 = "&apikey=c47454a1";           //The client key for the API.
export default class SearchMovieLWC extends LightningElement {
    imdbid;
    showval;
    backupimg;
    datafound;
    nodata;
    urltocall;  
    @track isModalOpen = false;
    @track isSubmit = false;
    @track isButtonClick = false;
    userName;
    userEmail;
    userPhone;
    movieDate;
    strFeedback;
    ratingScore;
    movieId;
    moviename;
       
    //Making Callout using fetch. 
    searchHandler() {
        fetch(this.urltocall)
            .then((response) => {
                if (!response.ok) {
                    this.error = response;
                }
                return response.json();
            })
            .then((jsonResponse) => {
                this.datafound = true;
                this.nodata = false;
                this.showval = jsonResponse;
                this.backupimg = false;
                console.log('Response================>'+JSON.stringify(showval));
 
                   
                    this.imdbid = JSON.stringify(this.showval.imdbID);
                    console.log('Imdb '+this.imdbid);
                    if (JSON.stringify(this.showval).includes("Error")) {
                        this.datafound = false;
                        this.nodata = true;
                    }
   
                    if (this.showval.Poster.includes("N/A")) {
                        this.backupimg = true;
                    }        
 
            })
            .catch((error) => {
                this.error = error;
            });
    }
    //Fetching the user input and creating the HTTP callout URL as required by the API endpoint
     movieNameChangeHandler(event) {
        let movieStr = event.target.value;
        this.moviename = movieStr;
        let finalurl = QUERY_URL + movieStr + QUERY_URL_2;
        this.urltocall = finalurl;
        console.log('moviename================>'+moviename);
    }
 
    radioButtonClickHandher(){
 
        this.isButtonClick = true;
    }
 
    get options() {
        return [
            { label: '5 Star', value: '5' },
            { label: '4 Star', value: '4' },
            { label: '3 Star', value: '3' },
            { label: '2 Star', value: '2' },
            { label: '1 Star', value: '1' },
        ];
    }
 
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        this.isButtonClick = false;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.isSubmit = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.isSubmit = true;
    }
 
    nameChangeHandler(event){
        this.userName = event.target.value;    
    }
    emailChangeHandler(event){
        this.userEmail = event.target.value;   
    }
    phoneChangeHandler(event){
        this.userPhone = event.target.value;    
    }
    dateChangeHandler(event){
        this.movieDate = event.target.value;   
    }
    ratingChangeHandler(event) {
        this.ratingScore = event.detail.value;    
    }
    feedbackChangeHandler(event) {
        this.strFeedback = event.target.value; 
    }
 
    createMovieRecordHandler(event){
        this.isSubmit = false;  
 
        const fields = {};
        
        fields[MOVIENAME_FIELD.fieldApiName] = this.moviename;
        fields[USERNAME_FIELD.fieldApiName] = this.userName;
        fields[USERPHONE_FIELD.fieldApiName] = this.userPhone;
        fields[USEREMAIL_FIELD.fieldApiName] = this.userEmail;
        fields[MOVIEDATE_FIELD.fieldApiName] = this.movieDate;
        fields[FEEDBACK_FIELD.fieldApiName] = this.strFeedback;
        fields[RATING_FIELD.fieldApiName] = this.ratingScore;
        

        console.log('Fields:' +JSON.stringify(fields));
 
        const objRecordInput = {
            apiName: MOVIE_OBJECT.objectApiName,
            fields: fields
          };
        
        createRecord(objRecordInput)
        .then(record => {
            this.movieId = record.id;
            this.moviename = fields[MOVIENAME_FIELD.fieldApiName];
            this.userName = fields[USERNAME_FIELD.fieldApiName];
            this.userPhone = fields[USERPHONE_FIELD.fieldApiName];
            this.userEmail = fields[USEREMAIL_FIELD.fieldApiName];
            this.movieDate = fields[MOVIEDATE_FIELD.fieldApiName];
            this.strFeedback = fields[FEEDBACK_FIELD.fieldApiName];
            this.ratingScore = fields[RATING_FIELD.fieldApiName];

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Thank You for Submitting Review',
                    variant: 'success',
                }),
            );
            alert('Thank You for Submitting Review');
            console.log('Movie created with Id: ' +record.id);
            console.log('Movie created  ' +JSON.stringify(record));
           //eval("$A.get('e.force:refreshView').fire();");
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
            alert('Sorry,Review is not submitted');
            console.log('Error Message: ' +error.body.message);
            
           //eval("$A.get('e.force:refreshView').fire();");
            
        });
        window.location.reload();
    }
}
