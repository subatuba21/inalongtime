import {EditorState} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '../../css/drafteditor.css';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {useState} from 'react';
import {LetterContent} from
  'shared/dist/editor/classes/letterContent';

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;

const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;

export const LetterEditor = (props: {letterContent? : LetterContent}) => {
  const letterContent : LetterContent =
    props.letterContent || new LetterContent('');
  const [letterContentState,
    setLetterContentState] = useState(letterContent);
  const [editorState, setEditorState] = useState(
      () => EditorState.createEmpty(),
  );

  return <>
    <Toolbar/>
    <Editor
      editorState={editorState}
      onChange={setEditorState} plugins={[toolbarPlugin, emojiPlugin]}/>
    <EmojiSuggestions/>
    <EmojiSelect/>
  </>;
};
