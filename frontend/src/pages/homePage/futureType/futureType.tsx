import styles from './futureType.module.css';

interface contentType {
    name: String;
    description: String;
    uses: String[];
    image: string
}

const types : Record<string, contentType> = {
  letter: {
    name: 'Letter',
    description: 'Send a message to the future.',
    uses: ['Emotional words', 'Pranks', 'Self-reflection'],
    image: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/envelope_2709-fe0f.png',
  },
  gallery: {
    name: 'Gallery',
    description: 'One or many photos and videos.',
    uses: ['Video message', 'Looking back on memories'],
    image: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/322/framed-picture_1f5bc-fe0f.png',
  },
  reminder: {
    name: 'Reminder',
    description: 'It will help you remember to do something.',
    uses: ['Something you might forget after a while'],
    image: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/twitter/322/alarm-clock_23f0.png',
  },
  goals: {
    name: 'Goals',
    description: 'Keep yourself accountable.',
    uses: ['Reflecting on a past goal', 'Motivation to succeed'],
    image: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/person-lifting-weights_1f3cb-fe0f.png',
  },
  journal: {
    name: 'Journal',
    description: 'Make an entry at regular intervals.',
    uses: ['Seeing your growth', 'Birthday letters'],
    image: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/open-book_1f4d6.png',
  },

};

export const FutureType = (props: {typeId: string, smallImage? : boolean}) => {
  const type = types[props.typeId];
  // eslint-disable-next-line no-unused-vars
  return <div style={styles} id={styles.container}>
    <h3>{type.name}</h3>
    <button className={styles.bottomButton}>Create</button>
    <div id={styles.image}>
      <img src={type.image} style={props.smallImage ?
        {width: '85%', height: '85%'} : {}}>
      </img>
    </div>
    <div id={styles.text}>
      {type.description} <br /><br />
      Great for:
      <ul>
        {type.uses.map((value) => <li key={0}>{value}</li>)}
      </ul>

    </div>
  </div>;
};
