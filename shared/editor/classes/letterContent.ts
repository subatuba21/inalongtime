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

  constructor() {
    super();
  }
}
