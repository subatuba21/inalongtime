import {Content, ContentType} from './content';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';

export type LetterData = {
  editorState: EditorState,
}

export class LetterContent extends Content {
  type: ContentType = 'letter';
  data?: LetterData;

  serialize() : object {
    if (this.initialized===false) {
      throw new Error('LetterContent has not been initialized.');
    }

    const data = this.data as LetterData;

    const serializedData = {
      editorState: convertToRaw(data.editorState.getCurrentContent()),
    }

    return {
      type: this.type,
      data: serializedData
    };
  }

  deserialize(data: any) {
    if (data.editorState) {
      this.data = {
        editorState: new EditorState(convertFromRaw(data.editorState)),
      }
      this.initialized = true;
    } else {
      throw new Error("Data does not fit parameters.");
    }
  }

  constructor() {
    super();
  }
}
