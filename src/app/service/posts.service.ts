import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = []
  private postsUpdated = new BehaviorSubject<Post[]>([]);

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3001/api/posts').subscribe((val) => {
      this.posts = val.posts
      this.postsUpdated.next([...this.posts])
    })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post:Post) {
    this.http.post<{message: string}>('http://localhost:3001/api/posts', post).subscribe((val) => {
      console.log(val.message)
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
    })
  }

  constructor(private http: HttpClient) { }
}
