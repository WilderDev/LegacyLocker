import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { FileUpload } from './file-upload.model';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  //* ==================== Properties ====================
  private basePath = '/uploads';

  //* ==================== Constructor ====================
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  //* ==================== Methods ====================
  // Create entry in firebase storage
  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    // path used to store upload
    const filePath = `${this.basePath}/${fileUpload.file.name}`;

    // filepath of where metadata is stored in fire realtime database
    const storageRef = this.storage.ref(filePath);

    // observable of the upload event
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges() // returns observable with metadata of the upload as they change (bytes transferred, metadata, ref, state, task, totalbytes)
      .pipe(
        finalize(() => {
          // returns observable which mirrors source observable but calls function when source terminates on complete or error
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            // Fetches metadata for the object at this location, if one exists.
            fileUpload.url = downloadURL; // saves metadata url
            fileUpload.name = fileUpload.file.name; // saves metadata file.name

            console.log(fileUpload)
            this.saveFileData(fileUpload); //! <----- This needs to change
            // right now it creates an entry in realtime db /uploads with name and url properties
            // needs to be added into the timecapsule entry with the associated timecapsule info
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges(); // returns an observable of the upload progress percentage
  }

  // Create reference of storage name and location
  private saveFileData(fileUpload: FileUpload): void {
    this.db.list('/timecapsules').push(fileUpload); //! <-- path needs to be different. needs to be part of timecapsule object
    // this is the method that takes the fileUpload object (name and url) and puts them into the realtime db at the location specified by this.basePath
  }

  // Read
  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems));
  }

  //* Delete
  // Delete database metadata for upload then delete file in firebase storage
  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch((error) => console.log(error));
  }

  // Delete metadata for upload from database
  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  // Delete upload from firebase storage
  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
