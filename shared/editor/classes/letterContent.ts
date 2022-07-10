import {Content, ContentType} from './content';
import {EditorState} from 'draft-js';

export class LetterContent implements Content {
  type: ContentType;
  data: EditorState;

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

  constructor(data: EditorState) {
    this.data = data;
    this.type = 'letter';
  }
}
