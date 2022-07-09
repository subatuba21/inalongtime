import {Content, ContentType} from './content';

export class LetterContent implements Content {
  type: ContentType;
  data: string;

  toJson() : Object {
    return {};
  }

  static fromJson(object: any): LetterContent {
    if (!this.validateJson(object)) {
      throw new Error('Invalid JSON');
    }
    return new LetterContent(object.data);
  }

  static validateJson(object: any) : boolean {
    if (object?.type === 'letter' && typeof object?.data === 'string') {
      return true;
    } return false;
  }

  constructor(data: string) {
    this.data = data;
    this.type = 'letter';
  }
}
