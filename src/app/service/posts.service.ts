import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = []
  private postsUpdated = new BehaviorSubject<Post[]>([]);

  getPosts() {
    this.http.get<{message: string, posts: {_id: string, title: string, content: string, imagePath: string | File}[]}>('http://localhost:3001/api/posts').pipe(map((res) => {
      return res.posts.map((post) => {
        return {title: post.title, content: post.content, id: post._id, imagePath: post.imagePath}
      })
    })).subscribe((val) => {
      this.posts = val
      this.postsUpdated.next([...this.posts])
    })
  }

  getPost(id: string) {
    return this.http.get<{message: string, post?: Post}>(`http://localhost:3001/api/posts/${id}`)
  }

  updatePost(post: Post) {
    if(typeof(post.imagePath) === 'object') {
      const postData = new FormData()
      postData.append('title', post.title)
      postData.append('content', post.content)
      postData.append('image', post.imagePath)
    } else {
      const postData: Post = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      }
    }

    this.http.patch<{message: string}>(`http://localhost:3001/api/posts/${post.id}`, post).subscribe((val) => {
      console.log(val.message)
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex((p) => {
        p.id = post.id
      })
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"])
      //this will route us to the home page
    })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post:Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title)
    postData.append('content', post.content)
    postData.append('image', image, post.title)
    this.http.post<{message: string, post: Post}>('http://localhost:3001/api/posts', postData).subscribe((val) => {
      const newPost: Post = {id: val.post.id, title: post.title, content: post.content, imagePath: val.post.imagePath}
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"])
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

  constructor(private http: HttpClient, private router: Router) { }
}
