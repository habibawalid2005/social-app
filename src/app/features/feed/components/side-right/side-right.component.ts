import { SearchFriendsInputComponent } from './../../../../ui/search-friends-input/search-friends-input.component';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { RouterLink } from "@angular/router";
import { Subscription } from 'rxjs';
import { SugestedUserComponent } from '../../../../ui/sugested-user/sugested-user.component';
import { LoadingComponent } from '../../../../ui/loading/loading.component';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [SugestedUserComponent, RouterLink, SearchFriendsInputComponent, LoadingComponent],
  templateUrl: './side-right.component.html',
  styleUrls: ['./side-right.component.css']
})
export class RightSidebarComponent implements OnInit {
  isHidden = true;
  SuggestionList: IsuggestedUser[] = [];
  private readonly userService = inject(UserService);
  inputValue: string = '';
  loading: boolean = true;
  subscription = new Subscription();

  ngOnInit(): void {
    this.getSearchSuggestionsData(this.inputValue);
  }


  showSuggested() {
    this.isHidden = !this.isHidden;
  }

  getSearchSuggestionsData(search: string): void {
    this.inputValue = search;
    this.loading = true;
    this.subscription.unsubscribe();
    this.subscription = this.userService.getSearchSuggestions(search, 4, 1).subscribe({
      next: (res) => {
        this.SuggestionList = res.data.suggestions;
        this.loading = false;

      },
      error: () => {
        this.loading = false;

      },
    })
  }


}
