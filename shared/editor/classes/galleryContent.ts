import {Component} from './component';
import {Content, ContentType} from './content';

export class GalleryContent implements Content {
  type: ContentType;
  data: {
    description: string,
    items: GalleryItem[],
  };

  toJson() : Object {
    return {};
  }

  static fromJson(): GalleryContent {
    return new GalleryContent({
      description: '',
      items: [],
    });
  }

  static validate() : boolean {
    return false;
  }

  constructor(data: GalleryData) {
    this.data = data;
    this.type = 'gallery';
  }
}

export interface GalleryData {
    description: string,
    items: GalleryItem[],
  };

export class GalleryItem implements Component {
  toJson() {

  }

  static fromJson() {

  }

  static validate() {

  }
}
