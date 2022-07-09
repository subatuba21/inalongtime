import {Component} from './component';

export type ContentType = 'gallery' | 'letter'
    | 'journal' | 'reminder' | 'goals';

export abstract class Content extends Component {
  data: any;
  type: ContentType;

  constructor(type: ContentType) {
    super();
    this.type = type;
  }
}
