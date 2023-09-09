import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = []
  private postsUpdated = new BehaviorSubject<Post[]>([]);

  getPosts() {
    return [...this.posts]
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post:Post) {
    this.posts.push(post)
    this.postsUpdated.next([...this.posts])
  }

  constructor() { }
}
