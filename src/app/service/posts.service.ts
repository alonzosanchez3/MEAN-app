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
    this.http.get<{message: string, posts: {_id: string, title: string, content: string}[]}>('http://localhost:3001/api/posts').pipe(map((res) => {
      return res.posts.map((post) => {
        return {title: post.title, content: post.content, id: post._id}
      })
    })).subscribe((val) => {
      this.posts = val
      this.postsUpdated.next([...this.posts])
    })
  }

  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)}
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post:Post) {
    this.http.post<{message: string, postId: string}>('http://localhost:3001/api/posts', post).subscribe((val) => {
      console.log(val.message)
      post.id = val.postId;
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
    })
  }

  deletePost(post: Post) {
    this.http.delete<{message: string}>(`http://localhost:3001/api/posts/${post.id}`).subscribe((val) => {
      const updatedPosts = this.posts.filter((_post) => {
        return post.id !== _post.id
      })
      this.posts = updatedPosts
      this.postsUpdated.next([...this.posts])
  })
  }

  constructor(private http: HttpClient) { }
}
