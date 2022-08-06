import {EditorState} from 'draft-js';
import {Content} from 'shared/dist/editor/classes/content';
import {LetterContent} from 'shared/dist/editor/classes/letterContent';
import {parseContent} from 'shared/dist/editor/parseContent';
import {stateToHTML} from 'draft-js-export-html';
import parse from 'html-react-parser';
import {ReminderContent} from 'shared/dist/editor/classes/reminderContent';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {editorAPI} from '../../api/editor';
import {DraftType, CustomizationSchema} from 'shared/dist/types/draft';
import styles from './ContentViewer.module.css';
import WebFont from 'webfontloader';
import {GalleryContent,
  MediaResourceArray} from 'shared/dist/editor/classes/galleryContent';
import {Carousel, CarouselItem} from 'react-bootstrap';
import {BaseMediaPlayer} from
  '../../components/BaseMediaPlayer/baseMediaPlayer';

export const ContentViewer = (props: {
    mode: 'preview' | 'future'
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string;

  if (!id) {
    navigate('/home');
    return <></>;
  }


  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Content | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [customization, setCustomization] =
  useState<CustomizationSchema | undefined>(undefined);
  const [contentType, setContentType] =
    useState<DraftType | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      if (props.mode === 'preview') {
        const res = await editorAPI.getDraft(id);
        if (res.success) {
          setContent(
              parseContent(res.data?.content,
                res.data?.properties.type as DraftType));

          setContentType(res.data?.properties.type);

          setTitle(res.data?.properties.title ?
            res.data?.properties.title : '');

          setCustomization(res.data?.properties.customization);
        }
        setIsLoading(false);
      } else {

      }
    };

    getData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let jsxContent : any = <></>;

  if (customization?.font) {
    WebFont.load({
      google: {
        families: [customization.font],
      },
    });
  }

  switch (contentType) {
    case 'letter': {
      const letter = content as LetterContent;
      const editorState = letter.editorState as EditorState;
      const currentContent = editorState.getCurrentContent();
      const htmlString = stateToHTML(currentContent);
      jsxContent = parse(htmlString);
      break;
    }

    case 'reminder': {
      const reminder = content as ReminderContent;
      jsxContent = <>
        <div id={styles.topRow}>
          <img src='https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/322/alarm-clock_23f0.png'
            id={styles.clock}></img>
          <div id={styles.subject}>
            <p>{reminder.subject}</p>
          </div>
        </div>
        <p id={styles.reminderText}>{reminder.text}</p>
      </>;
      break;
    }

    case 'gallery': {
      const gallery = content as GalleryContent;
      const galleryItems : any[] = [];
      (gallery.mediaResourceArray as MediaResourceArray)
          .forEach((media, i) => {
            galleryItems.push(<CarouselItem key={i}>
              <BaseMediaPlayer
                type={media.mimetype}
                src={`/api/draft/${id}/resource/${media.mediaResourceID}`}
                style={{}}></BaseMediaPlayer>
              <Carousel.Caption className={styles.carouselCaption}
                style={!media.caption ? {height: '0px'} : {}}>
                <p style={{padding: '10px'}}>{media.caption}</p>
              </Carousel.Caption>

            </CarouselItem>);
          });

      jsxContent = jsxContent = <>
        <p className={styles.description}>{gallery.description}</p>
        <Carousel variant="dark" interval={null}>
          {
            galleryItems
          }
        </Carousel>
      </>;
    }
  }

  return <div id={styles.background} style={{
    backgroundColor: customization?.backgroundColor ?
  customization.backgroundColor : '#fff'}}>
    <div id={styles[contentType || 'none']} style={{
      color: customization?.fontColor ? customization.fontColor : '#000',
      fontFamily: customization?.font ? customization.font : 'Open Sans',
    }}>
      <header>{title}</header>
      <span className={styles.createdOn}>Sent on January 1st, 2010</span>
      <span className={styles.author}>By Subhajit Das</span>
      {jsxContent}
    </div>
  </div>;
};
