import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  key: string;

  constructor(private http: HttpClient) {
    this.getAccesKey().then(res => {
      if (res) {
        this.key = res;
      }

    });
  }

  generateRandomMail(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let mail = '';
    for (let i = 0; i < 15; i++) {
      mail += chars[Math.floor(Math.random() * chars.length)];
    }
    return mail + '@vs.com';
  }

  async getAccesKey(): Promise<string> {
    if (!this.key) {
      let res: any = '';
      while (!res && !res.account) {
        const mail = this.generateRandomMail();
        const url = 'https://emoji-api.com/ui-api/create-account';
        const body = {email: mail};
        res = await this.http.post(url, body).toPromise();
      }
      return res.account.access_key;
    } else {
      return '';
    }

  }

  public async getWholeEmojiList(): Promise<any> {
    let m = this.key;
    if (!m) {
      m = await this.getAccesKey();
    }
    const url = `https://emoji-api.com/emojis?access_key=${m}`;
    // const url = ' https://emoji-api.com/categories?access_key=252a7cde18bfadaeb55c8785fb45b898be1bf8cc';
    // const url = 'localhost:3000';https://emoji-api.com/emojis?access_key=252a7cde18bfadaeb55c8785fb45b898be1bf8cc


    const result = await this.http.get(url).toPromise();

    return result;

  }

  public async getCategories(): Promise<any> {
    if (!this.key) {
      await this.getAccesKey();
    }
    // const url = 'https://emoji-api.com/emojis?access_key=${this.key}';
    const url = `https://emoji-api.com/categories?access_key==${this.key}`;
    // const url = 'localhost:3000';https://emoji-api.com/emojis?access_key=252a7cde18bfadaeb55c8785fb45b898be1bf8cc


    const result = await this.http.get(url).toPromise();

    return result;

  }

  public async getSingleEmoji(name): Promise<any> {
    if (!this.key) {
      await this.getAccesKey();
    }
    const url = `https://emoji-api.com/emojis/${name}?access_key=${this.key}`;
    const result = this.http.get(url).toPromise();

    return result;

  }

  public async searchEmoji(name): Promise<any> {
    if (!this.key) {
      await this.getAccesKey();
    }
    const url = `https://emoji-api.com/emojis?search=${name}&access_key=${this.key}`;
    const result = this.http.get(url).toPromise();

    return result;

  }
}
