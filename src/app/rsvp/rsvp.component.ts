import { Component, OnInit } from '@angular/core';
import { GuestsService } from '../guests.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {

  constructor(private guestsService: GuestsService) { }
  guests;
  formattedGuests;
  guest;
  numberOfSeatsAllowedArray: Array<number> = [];
  selectedPlusNumber = null;
  isProcessing: boolean = false;
  error: boolean = false;
  private value:any = {};
  submitted: boolean = false;
  isNumberOfSeatsSelected: boolean = false;

  ngOnInit() {
    this.guestsService.getGuests();
    this.guestsService.allGuests.subscribe(guests => this.guests = guests);
    this.guestsService.allGuests.subscribe(guests => this.formattedGuests = guests.map(guest =>  ({id: guest._id, text: guest.name, cool: 'ok' }) ));
  }

  public rsvp() {
    this.submitted = true;
    if(this.isNumberOfSeatsSelected) {
      this.isProcessing = true;
      if(this.guest.number_of_seats_confirmed === 0) {
        this.guest.declined = true;
      } else {
        this.guest.confirmed = true;
      }
      this.guestsService.updateGuest(this.guest)
        .subscribe(data => {
          this.isNumberOfSeatsSelected = false;
          this.submitted = false;
          this.isProcessing = false;
        }, error => {
          this.isNumberOfSeatsSelected = false;
          this.submitted = false;
          this.isProcessing = false;
        });
    }
  }

  public selected(value:any):void {
    this.guest = this.guests.filter(guest => guest._id === value.id)[0];
    this.submitted = false;
    const numberOfSeatsAllowed = this.guest.number_of_seats_allowed;
    this.selectedPlusNumber = null;
    this.numberOfSeatsAllowedArray = new Array(numberOfSeatsAllowed);
  }

  numberSelected() {
    this.isNumberOfSeatsSelected = true;
  }

  public removed(value:any):void {
    this.guest = null;
    this.selectedPlusNumber = null;
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }

}
