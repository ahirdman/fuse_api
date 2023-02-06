import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Timestamp } from 'firebase-admin/firestore';
import { firestore } from '../lib/admin.firebase';

interface IUserDocArgDto {
  uid: string;
}

interface IUserDocSpotifyMapArgDto extends IUserDocArgDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class FirestoreService {
  public async setUserDocSpotifyMap(payload: IUserDocSpotifyMapArgDto) {
    const { accessToken, refreshToken, uid } = payload;

    await this.userDocRef(uid).set({
      spotifyToken: {
        accessToken,
        refreshToken,
        updatedAt: Timestamp.now(),
      },
    });
  }

  public async getUserDoc(user: IUserDocArgDto) {
    const docRef = this.userDocRef(user.uid);

    const document = await docRef.get();

    if (!document.exists) {
      throw new HttpException(
        { reason: 'User document not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return document.data();
  }

  private userDocRef(uid: string) {
    return firestore.doc(`users/${uid}`);
  }
}
