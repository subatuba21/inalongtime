import {Content, ContentType} from './content';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';

export type LetterData = {
  editorState: object,
}

export class LetterContent extends Content {
  type: ContentType = 'letter';
  editorState?: EditorState;

  serialize() : LetterData {
    if (this.initialized===false) {
      throw new Error('LetterContent has not been initialized.');
    }

    const serializedData = {
      editorState: convertToRaw((this.editorState as EditorState).getCurrentContent()),
    }

    return serializedData;
  }

  deserialize(data: any) {
    if (data.editorState) {
      this.editorState = EditorState.createWithContent(convertFromRaw(data.editorState));
      this.initialized = true;
    } else {
      throw new Error("Data does not fit parameters.");
    }
  }

  initialize(args: {
    editorState: EditorState,
  }): void {
      this.editorState = args.editorState;
      this.initialized = true;
  }

  getWordCount() {
    if (!this.initialized) throw new Error("Letter content has not been initialized.");
    const plainText = (this.editorState as EditorState).getCurrentContent().getPlainText('');
    const regex = /(?:\r\n|\r|\n)/g;  // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g);  // matches words according to whitespace
    return wordArray ? wordArray.length : 0;
  }

  constructor() {
    super();
  }
}
