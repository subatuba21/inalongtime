import {DraftType} from '../../types/draft';
import {Component} from './component';

export type ContentType = DraftType;

export abstract class Content extends Component {
  data: any;
  type: ContentType;

  constructor(type: ContentType) {
    super();
    this.type = type;
  }
}
