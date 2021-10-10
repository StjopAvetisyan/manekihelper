import {Component} from '@angular/core';
import {ApiService} from './api.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smmhelper';
  emojis = [];
  categories: any;
  categoryNames: any;
  searchValue: any;
  results: any;
  globalResult = '';
  err: any;
  onResults = false;
  noResult = false;


  constructor(private apiService: ApiService, private clipboard: Clipboard, private _snackBar: MatSnackBar) {
    this.getList();
  }

  copyResultToClipboard(): void {
    this.clipboard.copy(this.globalResult);
    this._snackBar.open(this.globalResult + ' copied ');
  }

  addToClipboard(text): void {

    this.clipboard.copy(text);
    this._snackBar.open(text + ' copied ');
    this.globalResult += text;
  }

  clearResultText(): void {
    this.globalResult = '';
  }

  async getList(): Promise<void> {
    try {
      this.onResults = false;
      this.results = [];
      const whole = await this.apiService.getWholeEmojiList();
      this.categories = this.categorise(whole);
      for (const category of this.categories) {
        category[0] = category[0].replace(/-/g, ' ').toUpperCase();
        category[2] = category[1].slice(0, 10);
      }
    } catch (e) {
      debugger

      this.err = e.message;
    }


  }

  async getResults(text): Promise<void> {
    try {
      const whole = await this.apiService.searchEmoji(text);
      if (whole) {
        this.results = this.categorise(whole);
        for (const category of this.results) {
          category[0] = category[0].replace(/-/g, ' ').toUpperCase();
          category[2] = category[1].length > 10 ? category[1].slice(0, 10) : category[1];
        }
        this.noResult = false;
      } else {
        this.results = [];
        this.noResult = true;
      }

      this.onResults = true;
    } catch (e) {
      this.err = e.message;
    }

  }

  categorise(whole): any {
    return Object.entries(this.groupBy(whole, 'group'));
  }

  resetSearch(): void {
    this.searchValue = '';
    this.onResults = false;
    this.results = [];
  }

  groupBy(xs, key): any {
    return xs.reduce((rv, x) => {

      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }


}
